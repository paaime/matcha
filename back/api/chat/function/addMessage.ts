// Import necessary modules and types
import { Response } from 'express';
import { Notification, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { messageRegex } from '../../../types/regex';
import {
  sendMessage,
  sendNotification,
} from '../../../websocket/initializeIo';
import { updateFame } from '../../../utils/fame';
import { logger } from '../../../utils/logger';

export const checkIfFieldExist = (
  name: string,
  field: string,
  res: Response
): number => {
  if (!field || field === '') {
    res.status(400).json({
      error: 'Bad request',
      message: `Property '${name}' is missing`,
    });

    return 1;
  }

  return 0;
};

export async function addMessage(
  matchId: number,
  imageUrl: string | null,
  req: RequestUser,
  res: Response
): Promise<void> {
  try {
    const userId = getAuthId(req);

    if (!userId || !Number.isInteger(userId) || userId < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    const content = imageUrl || req.body?.content;

    if (checkIfFieldExist('content', content, res)) return;

    // Test values with regex
    if (!imageUrl) {
      const trimLength = content.trim()?.length;

      if (!messageRegex.test(content) || trimLength < 1 || trimLength > 300) {
        res.status(422).json({
          error: 'Unprocessable entity',
          message: 'Invalid message',
        });
        return;
      }
    }

    const db = await connectToDatabase();

    if (!db) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    // Insert new message into the Chat table
    const query = `
      INSERT INTO Chat (match_id, user_id, content, type)
      VALUES (?, ?, ?, ?);
    `;

    const [rowsChat] = (await db.query(query, [
      matchId,
      userId,
      content,
      imageUrl ? 'image' : 'text',
    ])) as any;

    // Get the id of the user who is not the current user
    const matchQuery = 'SELECT user_id, other_user_id FROM Matchs WHERE id = ?';
    const [rowsMatch] = (await db.query(matchQuery, [matchId, userId])) as any;

    if (!rowsMatch || rowsMatch.length === 0) {
      res.status(404).json({
        error: 'Match not found',
        message: 'Match not found',
      });
      return;
    }

    const otherUserId =
      rowsMatch[0].user_id === userId
        ? rowsMatch[0].other_user_id
        : rowsMatch[0].user_id;

    // Get the pictures of the current user
    const userQuery = 'SELECT pictures, username FROM User WHERE id = ?';
    const [rowsUser] = (await db.query(userQuery, [userId])) as any;

    if (!rowsUser || rowsUser.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    // Close the connection
    await db.end();

    const message = {
      id: rowsChat.insertId,
      match_id: matchId,
      user_id: userId,
      username: rowsUser[0].username,
      pictures: rowsUser[0].pictures,
      content,
      type: imageUrl ? 'image' : 'text',
      created_at: new Date().toUTCString(),
    };

    // Send socket notification to the other user
    await sendMessage(otherUserId.toString(), message);

    await sendNotification(otherUserId.toString(), {
      content: 'You have a new message',
      redirect: `/chat/${matchId}`,
      related_user_id: userId,
    } as Notification);

    // Update fame
    await updateFame(otherUserId, 'newMessage');

    // Send the array of liked users as JSON response
    res.status(200).json(message);
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while getting chats.',
    });
  }
}
