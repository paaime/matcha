import { Response } from 'express';
import { Notification, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { updateFame } from '../../../utils/fame';

export async function blockUser(block_id: number, req: RequestUser, res: Response): Promise<void> {
  try {
    const user_id = getAuthId(req);

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    if (!block_id || block_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid block_id',
      });
      return;
    }

    if (block_id === user_id) {
      res.status(400).json({
        error: 'Bad request',
        message: 'You cannot report yourself',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if the user exists
    const [rows] = (await db.query('SELECT firstName FROM User WHERE id = ?', [block_id])) as any;

    if (!rows || rows.length === 0) {
      // Close the connection
      await db.end();

      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const firstName = rows[0].firstName;

    // Remove like
    const queryRemoveLike = 'DELETE FROM UserLike WHERE user_id = ? AND liked_user_id = ?';
    await db.query(queryRemoveLike, [user_id, block_id]) as any;

    // Add blockedd
    const query = 'INSERT INTO Blocked (user_id, blocked_user_id) VALUES (?, ?)';
    await db.query(query, [user_id, block_id]) as any;

    // Close the connection
    await db.end();

    // Send notifications
    await sendNotification(block_id.toString(), {
      content: 'Someone blocked you',
      redirect: `/profile/${user_id}`,
      related_user_id: user_id
    } as Notification);
    await sendNotification(user_id.toString(), {
      content: `You blocked ${firstName}`,
      redirect: `/profile/${block_id}`,
      related_user_id: block_id
    } as Notification);

    // Update fame
    await updateFame(block_id, 'newBlock');

    res.status(200).json({
      reported: true
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // Check if duplicate entry
    if (code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        error: 'Bad request',
        message: 'You already blocked this user',
      });
      return;
    }

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'Error while blocking the user',
    });
  }
}
