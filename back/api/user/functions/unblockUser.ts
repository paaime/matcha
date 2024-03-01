import { Response } from 'express';
import { Notification, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { updateFame } from '../../../utils/fame';

export async function unblockUser(unblock_id: number, req: RequestUser, res: Response): Promise<void> {
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

    if (!unblock_id || unblock_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid unblock_id',
      });
      return;
    }

    if (unblock_id === user_id) {
      res.status(400).json({
        error: 'Bad request',
        message: 'You cannot unblock yourself',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if the user exists
    const [rows] = (await db.query('SELECT firstName FROM User WHERE id = ?', [unblock_id])) as any;

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

    // Check if user is blocked
    const [rowsBlocked] = (await db.query('SELECT id FROM Blocked WHERE user_id = ? AND blocked_user_id = ?', [user_id, unblock_id])) as any;

    if (!rowsBlocked || rowsBlocked.length === 0) {
      // Close the connection
      await db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'User not blocked',
      });
      return;
    }

    // Remove blocked
    const query = 'DELETE FROM Blocked WHERE user_id = ? AND blocked_user_id = ?';
    await db.query(query, [user_id, unblock_id]) as any;

    // Close the connection
    await db.end();

    // Send notifications
    await sendNotification(unblock_id.toString(), {
      content: 'Someone unblocked you',
      related_user_id: user_id,
    } as Notification);
    await sendNotification(user_id.toString(), {
      content: `You unblocked ${firstName}`,
      redirect: `/profile/${unblock_id}`,
      related_user_id: unblock_id,
    } as Notification);

    res.status(200).json({
      unblocked: true
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'Error while unblocking the user',
    });
  }
}
