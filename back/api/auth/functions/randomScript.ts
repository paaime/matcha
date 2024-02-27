import { Response } from 'express';
import { connectToDatabase } from '../../../utils/db';
import { addRandom } from './addRandom';
import { interestsList } from '../../../types/list';

// TODO: temporary, remove when the real api is ready

export async function randomScript(res: Response): Promise<undefined>{
  try {
    const db = await connectToDatabase();

    // Clean Tags, UserLike, User, Chat, Notification, Matchs, History, Blocked, Reported
    await db.query('DELETE FROM Tags');
    await db.query('DELETE FROM UserLike');
    await db.query('DELETE FROM User');
    await db.query('DELETE FROM Chat');
    await db.query('DELETE FROM Notification');
    await db.query('DELETE FROM Matchs');
    await db.query('DELETE FROM History');
    await db.query('DELETE FROM Blocked');
    await db.query('DELETE FROM Reported');

    // First, generate 10 users
    for (let i = 0; i < 10; i++) {
      await addRandom(res, false);
    }

    // Then, get the users
    const query = 'SELECT * FROM User';

    const [rows] = await db.query(query) as any;

    const minId = rows[0].id;
    const maxId = rows[rows.length - 1].id;

    // Add random tags to the users
    for (const row of rows) {
      const userId = row.id;

      const tagsToAdd = interestsList.sort(() => Math.random() - 0.5).slice(0, 3);

      for (const tag of tagsToAdd) {
        const query = 'INSERT INTO Tags (user_id, tagName) VALUES (?, ?)';

        await db.query(query, [userId, tag]);
      }
    }

    // Add random likes
    for (const row of rows) {
      const userId = row.id;

      const randomUserId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

      if (randomUserId !== userId) {
        const query = 'INSERT INTO UserLike (user_id, liked_user_id) VALUES (?, ?)';

        await db.query(query, [userId, randomUserId]);
      }
    }

    // Close the connection
    await db.end();

    res.status(200).json({
      message: 'Script executed'
    });
  } catch (error) {
    console.error('Error while adding user', ':', error);

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the user'
    });
  }
}
