import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { interestsList } from '../../../types/list';

const MAX_TAGS = 5;
const MIN_TAGS = 3;

export async function randTags(res: Response, total: number): Promise<boolean>{
  total = total > MAX_TAGS ? MAX_TAGS : total;
  total = total < MIN_TAGS ? MIN_TAGS : total;

  try {
    const db = await connectToDatabase();

    // Get the users
    const [rows] = await db.query('SELECT * FROM User') as any;

    // Clear tags
    await db.query('DELETE FROM Tags');

    for (const row of rows) {
      const userId = row.id;

      // New set of tags
      const tags = interestsList.sort(() => Math.random() - 0.5).slice(0, total);

      for (const tag of tags) {
        const query = 'INSERT INTO Tags (user_id, tagName) VALUES (?, ?)';
        await db.query(query, [userId, tag]);
      }
    }

    // Close the connection
    await db.end();

    res.status(200).json({
      message: 'Script executed'
    });
    return true;
  } catch (error) {
    console.error('Error while adding user', ':', error);

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while adding the user'
    });
    return false;
  }
}
