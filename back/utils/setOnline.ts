import { connectToDatabase } from './db';
import { ThrownError } from '../types/type';

export async function setOnline(user_id: number, isOnline: boolean): Promise<boolean>{
  try {
    // Check user_id
    if (!user_id || !Number.isInteger(user_id) || user_id < 1) {
      return false;
    }

    const db = await connectToDatabase();

    // Update the user's isOnline and lastConnection
    if (isOnline) {
      const updateQuery = 'UPDATE User SET isOnline = ?, lastConnection = NOW() WHERE id = ?';
      await db.query(updateQuery, [1, user_id]);
    } else {
      const updateQuery = 'UPDATE User SET isOnline = ?, lastConnection = NOW() WHERE id = ?';
      await db.query(updateQuery, [0, user_id]);
    }

    // Close the connection
    db.end();

    return true;
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    console.error({ code, message });
    
    return false;
  }
}
