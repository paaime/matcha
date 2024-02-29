import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { updateFame } from '../../../utils/fame';
import { sendNotification } from '../../../websocket/functions/initializeIo';

const NB_RANDOM_VISITS = 15;

export async function randVisits(res: Response, total: number): Promise<boolean>{
  total = total > NB_RANDOM_VISITS ? NB_RANDOM_VISITS : total;
  total = total < 1 ? 1 : total;

  try {
    const db = await connectToDatabase();

    // Then, get the users
    const [rows] = await db.query('SELECT * FROM User') as any;

    const minId = rows[0].id;
    const maxId = rows[rows.length - 1].id;

    for (const row of rows) {
      const userId = row.id;

      // Add random visit with id between minId and maxId
      const randomUsers = Array.from({ length: NB_RANDOM_VISITS }, () => Math.floor(Math.random() * (maxId - minId + 1) + minId));

      for (const visit of randomUsers) {
        if (visit === userId) {
          continue;
        }

        const query = 'INSERT INTO History (user_id, visited_user_id) VALUES (?, ?)';

        await db.query(query, [userId, visit]);

        // Update fame
        await updateFame(visit, 'newVisit');

        await sendNotification(visit.toString(), {
          content: 'Someone visited your profile',
          redirect: '/settings',
          related_user_id: userId,
        });
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
