import { Connection } from 'mysql2/promise';

import { updateFame } from '../../../utils/fame';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { Notification } from '../../../types/type';

const MAX_LIKES = 30;

export async function randLikes(total: number, db: Connection): Promise<boolean>{
  total = total > MAX_LIKES ? MAX_LIKES : total;
  total = total < 1 ? 1 : total;

  try {
    // Get the users
    const [rows] = await db.query('SELECT * FROM User') as any;

    for (const row of rows) {
      const userId = row.id;

      // Get ids from User where  and sexualPreferences = sexualPreferences
      const users = rows
        .filter((user: any) => user.id !== userId)
        .filter((user: any) => user.gender === row.sexualPreferences && user.sexualPreferences === row.gender);

      // Get random user ids
      const randomUserId = users.map((user: any) => user.id).sort(() => Math.random() - 0.5).slice(0, total);

      for (const like of randomUserId) {
        if (like === userId) {
          continue;
        }

        const isSuper = Math.random() < 0.2;

        const query = 'INSERT INTO UserLike (user_id, liked_user_id, isSuperLike) VALUES (?, ?, ?)';
        await db.query(query, [userId, like, isSuper ? 1 : 0]);
      }
    }

    // Send notifications for new matchs
    const [match] = await db.query('SELECT * FROM Matchs') as any;

    for (const m of match) {
      await updateFame(m.user_id, 'newMatch');
      await updateFame(m.other_user_id, 'newMatch');
      await sendNotification(m.user_id.toString(), {
        content: 'You have a new match 🎉',
        redirect: '/likes',
        related_user_id: m.other_user_id,
      } as Notification);
      await sendNotification(m.other_user_id.toString(), {
        content: 'You have a new match 🎉',
        redirect: '/likes',
        related_user_id: m.user_id,
      } as Notification);
    }

    return true;
  } catch (error) {
    return false;
  }
}
