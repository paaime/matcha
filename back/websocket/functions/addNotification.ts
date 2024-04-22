import { connectToDatabase } from '../../utils/db';
import { Notification, ThrownError } from '../../types/type';
import { logger } from '../../utils/logger';

export async function addNotification(
  user_id: number,
  body: Notification
): Promise<boolean> {
  try {
    // Get infos from body
    const { content, redirect, related_user_id } = body;

    // Check if fields exist
    if (!content || content.length < 1) {
      throw new Error('Missing fields');
    }

    const db = await connectToDatabase();

    if (!db) {
      return false;
    }

    // Add the notification
    const query =
      'INSERT INTO Notification (user_id, content, redirect, related_user_id) VALUES (?, ?, ?, ?)';
    const [rows] = (await db.query(query, [
      user_id,
      content,
      redirect,
      related_user_id,
    ])) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.affectedRows === 0) {
      throw new Error('Notification not added');
    }

    return true;
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    return false;
  }
}
