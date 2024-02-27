// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function getLikes(req: RequestUser, res: Response): Promise<void> {
  try {
    const userId = getAuthId(req);

    if (!userId || !Number.isInteger(userId) || userId < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    const db = await connectToDatabase();

    // Get my sexual preferences
    const [rowsPreferences] = (await db.query(
      'SELECT age FROM User WHERE id = ?',
      [userId]
    )) as any;

    if (!rowsPreferences || rowsPreferences.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const myAge = rowsPreferences[0].age;

    // Query to get users who liked the current user
    const query = `
      SELECT
        u.id,
        u.firstName,
        u.isOnline,
        u.age,
        u.consentLocation,
        u.loc,
        u.gender,
        u.city,
        u.pictures,
        u.fameRating,
        ul.isSuperLike,
        (
          (100 - ABS(u.age - :myAge)) + (u.fameRating / 100)
        ) AS compatibilityScore,
        m.user_id IS NOT NULL AS isMatch
      FROM
        User u
      LEFT JOIN
        Matchs m
      ON
        (u.id = m.user_id AND m.other_user_id = :userId)
      OR
        (u.id = m.other_user_id AND m.user_id = :userId)
      INNER JOIN
        UserLike ul ON u.id = ul.user_id
      WHERE
        ul.liked_user_id = :userId
    `;

    // Execute the query
    const [rows] = await db.query(query, {
      userId,
      myAge,
    }) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users who liked
    const users: ILove[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: ILove = {
        id: row.id,
        isOnline: row.isOnline === 1,
        firstName: row.firstName,
        age: row.age,
        gender: row.gender,
        city: row.city,
        pictures: row.pictures,
        distance: -1,
        isMatch: !!row.isMatch,
        isSuperLike: row.isSuperLike === 1,
        compatibilityScore: row.compatibilityScore
      };

      // Push liked user object to the array
      users.push(user);
    }

    // Send the array of liked users as JSON response
    res.status(200).json(users);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while getting liked user information',
    });
  }
}
