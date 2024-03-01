// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { IPreviewChat } from '../../../types/chat';

export async function getChats(req: RequestUser, res: Response): Promise<void> {
  try {
    const userId = getAuthId(req);

    if (!userId || !Number.isInteger(userId) || userId < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    const db = await connectToDatabase();

    // Query to get all chats
    const query = `
      SELECT
        m.id AS match_id,
        u.id AS user_id,
        u.username AS username,
        u.firstName AS firstName,
        u.isOnline AS isOnline,
        u.pictures AS user_pictures,
        c.content AS lastMessage,
        c.created_at AS lastMessageDate
      FROM
        Matchs m
      INNER JOIN
        User u ON (m.user_id = u.id AND m.other_user_id = :userId)
              OR (m.other_user_id = u.id AND m.user_id = :userId)
      LEFT JOIN Chat c ON m.id = c.match_id AND c.created_at = (
        SELECT MAX(created_at)
        FROM Chat
        WHERE match_id = m.id
      )
    `;

    // Execute the query
    const [rows] = (await db.query(query, {
      userId,
    })) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users who liked
    const users: IPreviewChat[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: IPreviewChat = {
        id: row.match_id,
        username: row.username,
        firstName: row.firstName,
        isOnline: row.isOnline,
        pictures: row.user_pictures,
        lastMessage: row.lastMessage,
        lastMessageDate: row.lastMessageDate,
      };

      // Push liked user object to the array
      users.push(user);
    }

    // Send the array of liked users as JSON response
    res.status(200).json(users);
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
