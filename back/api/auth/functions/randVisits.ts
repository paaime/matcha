import { Connection } from 'mysql2/promise';

import { updateFame } from '../../../utils/fame';
import { sendNotification } from '../../../websocket/initializeIo';
import { Notification } from '../../../types/type';

const NB_RANDOM_VISITS = 15;

export async function randVisits(total: number, db: Connection): Promise<boolean>{
  total = total > NB_RANDOM_VISITS ? NB_RANDOM_VISITS : total;
  total = total < 1 ? 1 : total;

  try {
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
        } as Notification);
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
