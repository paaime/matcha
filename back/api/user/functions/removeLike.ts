import { Response } from 'express';
import { Notification, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/initializeIo';
import { updateFame } from '../../../utils/fame';
import { logger } from '../../../utils/logger';

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

    if (!db) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    // Check if the user exists
    const [rows] = (await db.query('SELECT id, firstName FROM User WHERE id = ?', [liked_id])) as any;

    if (!rows || rows.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const firstName = rows[0].firstName;

    // Check if a match exists
    const queryMatch = 'SELECT id FROM Matchs WHERE user_id IN (?, ?) AND other_user_id IN (?, ?)';
    const [rowsMatch] = (await db.query(queryMatch, [user_id, liked_id, liked_id, user_id])) as any;

    // Remove the like
    const query = 'DELETE FROM UserLike WHERE user_id = ? AND liked_user_id = ?';
    await db.query(query, [user_id, liked_id]) as any;

    // Remove the match
    const queryDelMatch = 'DELETE FROM Matchs WHERE user_id IN (?, ?) AND other_user_id IN (?, ?)';
    await db.query(queryDelMatch, [user_id, liked_id, liked_id, user_id]) as any;

    // Close the connection
    await db.end();

    // Update the fame
    await updateFame(liked_id, 'dislike');

    if (rowsMatch && rowsMatch.length > 0) {
      await sendNotification(liked_id.toString(), {
        content: 'You lost a match',
        redirect: '/likes',
        related_user_id: user_id,
      } as Notification);
      
      await sendNotification(user_id.toString(), {
        content: 'You lost a match',
        redirect: '/likes',
        related_user_id: liked_id,
      } as Notification);

      res.status(200).json({
        unliked: true,
        hadMatch: true
      });
      return;
    }

    await sendNotification(liked_id.toString(), {
      content: 'Someone unliked you',
      redirect: '/likes',
      related_user_id: user_id,
    } as Notification);

    await sendNotification(user_id.toString(), {
      content: 'You unliked ' + firstName,
      redirect: '/likes',
      related_user_id: liked_id,
    } as Notification);

    res.status(200).json({
      unliked: true,
      hadMatch: false
    });

  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Internal server error',
      message: 'Error removing like',
    });
  }
}
