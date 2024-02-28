import { connectToDatabase } from './db';
import { ThrownError } from '../types/type';

export async function addVisit(
  user_id: number,
  visited_user_id: number
): Promise<boolean> {
  try {
    // Check user_id
    if (!user_id || !Number.isInteger(user_id) || user_id < 1) {
      return false;
    }

    // Check visited_user_id
    if (
      !visited_user_id ||
      !Number.isInteger(visited_user_id) ||
      visited_user_id < 1
    ) {
      return false;
    }

    if (visited_user_id === user_id) {
      return false;
    }

    const db = await connectToDatabase();

    // Add visit
    const updateQuery =
      'INSERT INTO History (user_id, visited_user_id) VALUES (?, ?)';
    await db.query(updateQuery, [user_id, visited_user_id]);

    // Close the connection
    db.end();

    return true;
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    return false;
  }
}
