// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { IChat, IMessage, IPreviewChat } from '../../../types/chat';

export async function getChatWithId(
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

    const db = await connectToDatabase();

    // Get username and first name and pictures
    const [rowsUser] = (await db.query(
      `
      SELECT
        u.id AS user_id,
        u.username AS username,
        u.firstName AS firstName,
        u.pictures AS pictures
      FROM
        User u
      INNER JOIN
        Matchs m ON (m.user_id = u.id AND m.id = :matchId)
              OR (m.other_user_id = u.id AND m.id = :matchId)
      `,
      {
        matchId,
      }
    )) as any;

    // Query to get all chats
    const query = `
      SELECT
        m.id AS chat_id,
        c.id AS message_id,
        c.user_id AS message_user_id,
        c.content AS message_content,
        MAX(c.created_at) AS message_created_at
      FROM
        Matchs m
      LEFT JOIN
        Chat c ON m.id = c.match_id
      WHERE
        m.id = :matchId
      GROUP BY
        c.id
      ORDER BY
        MAX(c.created_at);
    `;

    // Execute the query
    const [rows] = (await db.query(query, {
      matchId,
    })) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    const otherUsername = rowsUser.find(
      (row: any) => row.user_id !== userId
    ).username;
    const otherFirstName = rowsUser.find(
      (row: any) => row.user_id !== userId
    ).firstName;
    const otherPictures = rowsUser.find(
      (row: any) => row.user_id !== userId
    ).pictures;

    // Iterate over the rows and create user objects
    const chat: IChat = {
      id: rows[0].match_id,
      username: otherUsername,
      firstName: otherFirstName,
      messages: rows
        .filter((row: any) => row.message_id != null)
        .map((row: any) => ({
          id: row.message_id,
          match_id: matchId,
          username: row.message_user_id === userId ? 'me' : otherUsername,
          user_id: row.message_user_id,
          pictures: otherPictures,
          content: row.message_content,
          created_at: row.message_created_at,
        })),
    };

    // Send the array of liked users as JSON response
    res.status(200).json(chat);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({
      // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting the chat.',
    });
  }
}
