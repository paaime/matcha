import { connectToDatabase } from '../../utils/db';
import { ThrownError } from '../../types/type';

export async function addNotification(user_id: number, body: any): Promise<boolean>{
  try {
    // Get infos from body
    const { content, redirect, related_id } = body;

    // Check if fields exist
    if (!content || content.length < 1) {
      throw new Error('Missing fields');
    }

    console.log('user_id', user_id, content);

    const db = await connectToDatabase();

    // Add the notification
    const query = 'INSERT INTO Notification (user_id, content, redirect, related_user_id) VALUES (?, ?, ?, ?)';
    const [rows] = await db.query(query, [user_id, content, redirect, related_id]) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.affectedRows === 0) {
      throw new Error('Notification not added');
    }

    return true;
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    return false;
  }
}
