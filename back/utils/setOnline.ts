import { connectToDatabase } from './db';
import { ThrownError } from '../types/type';
import { logger } from './logger';

export async function setOnline(user_id: number, isOnline: boolean): Promise<boolean>{
  try {
    // Check user_id
    if (!user_id || !Number.isInteger(user_id) || user_id < 1) {
      return false;
    }

    const db = await connectToDatabase();

    if (!db) {
      return false;
    }

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

    logger(e);
    
    return false;
  }
}
