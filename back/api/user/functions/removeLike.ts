import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function removeLike(liked_id: number, req: RequestUser, res: Response): Promise<void> {
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
        message: 'You cannot unlike yourself',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if the user exists
    const [rows] = (await db.query('SELECT id FROM User WHERE id = ?', [liked_id])) as any;

    if (!rows || rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    // Check if a match exists
    const queryMatch = 'SELECT id FROM UserLike WHERE user_id = ? AND liked_user_id = ?';
    const [rowsMatch] = await db.query(queryMatch, [liked_id, user_id]) as any;

    // Remove the like
    const query = 'DELETE FROM UserLike WHERE user_id = ? AND liked_user_id = ?';
    const [rowsLikes] = await db.query(query, [user_id, liked_id]) as any;

    if (!rowsLikes || rowsLikes.affectedRows === 0) {
      // Close the connection
      await db.end();

      res.status(501).json({
        error: 'Server error',
        message: 'Like not added',
      });
      return;
    }

    if (rowsMatch && rowsMatch.length > 0) {
      res.status(200).json({
        unliked: true,
        hadMatch: true
      });
      return;
    }

    res.status(200).json({
      unliked: true,
      hadMatch: false
    });

  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';


    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'Error removing like',
    });
  }
}
