import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/functions/initializeIo';

export async function addLike(
  liked_id: number,
  req: RequestUser,
  res: Response
): Promise<void> {
  console.log('addLike', liked_id);
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

    if (!liked_id || liked_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid liked_id',
      });
      return;
    }

    if (liked_id === user_id) {
      res.status(400).json({
        error: 'Bad request',
        message: 'You cannot like yourself',
      });
      return;
    }

    const { superLike } = req.body;

    const db = await connectToDatabase();

    const isSuper = superLike === true;

    // Check if the user exists
    const [rows] = (await db.query('SELECT id FROM User WHERE id = ?', [
      liked_id,
    ])) as any;

    if (!rows || rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    // Add the like
    const query = 'INSERT INTO UserLike (user_id, liked_user_id, isSuperLike) VALUES (?, ?, ?)';
    const [rowsLikes] = (await db.query(query, [user_id, liked_id, isSuper])) as any;

    if (!rowsLikes || rowsLikes.affectedRows === 0) {
      // Close the connection
      await db.end();

      res.status(501).json({
        error: 'Server error',
        message: 'Like not added',
      });
      return;
    }

    // Check if a match is created
    const [rowsMatch] = (await db.query(
      `
      SELECT id
      FROM Matchs
      WHERE
        user_id IN (?, ?)
        AND other_user_id IN (?, ?)
      `,
      [user_id, liked_id, user_id, liked_id]
    )) as any;

    // Close the connection
    await db.end();

    if (rowsMatch && rowsMatch.length > 0) {
      await sendNotification(liked_id.toString(), {
        content: 'You have a new match',
        redirect: '/likes',
        related_user_id: user_id,
      });

      res.status(200).json({
        liked: true,
        match: true,
      });
      return;
    }

    await sendNotification(liked_id.toString(), {
      content: isSuper ? 'You have a new super like' : 'You have a new like',
      redirect: '/likes',
      related_user_id: user_id,
    });

    res.status(200).json({
      liked: true,
      match: false,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // Check if duplicate entry
    if (code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        error: 'Bad request',
        message: 'Like already added',
      });
      return;
    }

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'Like not added',
    });
  }
}
