// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { messageRegex } from '../../../types/regex';
import { sendMessage } from '../../../websocket/functions/initializeIo';

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

    const { content } = req.body;

    if (checkIfFieldExist('content', content, res)) return;

    // Test values with regex
    if (!messageRegex.test(content)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid message',
      });
      return;
    }

    const db = await connectToDatabase();

    // Insert new message into the Chat table
    const query = `
      INSERT INTO Chat (match_id, user_id, content)
      VALUES (?, ?, ?);
    `;

    const [rowsChat] = (await db.query(query, [
      matchId,
      userId,
      content,
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
      created_at: new Date().toUTCString(),
    };

    // Send socket notification to the other user
    await sendMessage(otherUserId.toString(), message);

    // Send the array of liked users as JSON response
    res.status(200).json(message);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({
      // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting chats.',
    });
  }
}
