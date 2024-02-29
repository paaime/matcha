// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove, IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function getLikesSent(
  req: RequestUser,
  res: Response
): Promise<void> {
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

    // Get my infos
    const [rowsPreferences] = (await db.query(`
      SELECT 
        u.age,
        u.loc,
        u.consentLocation,
        u.gender,
        u.sexualPreferences,
        u.fameRating,
        GROUP_CONCAT(ti.tagName) AS interests
      FROM
        User u
        LEFT JOIN Tags ti ON u.id = ti.user_id
      WHERE
        u.id = ?
      GROUP BY
        u.id,
        u.age,
        u.loc,
        u.consentLocation,
        u.gender,
        u.sexualPreferences;
      `,
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
    const myLoc = rowsPreferences[0].loc;
    const myInterests = rowsPreferences[0].interests;
    const myFame = rowsPreferences[0].fameRating;
    
    const myLat = myLoc?.split(',')[0];
    const myLon = myLoc?.split(',')[1];

    // Query to get users to whom the current user has sent likes
    const query = `
      SELECT
        u.id,
        u.username,
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
          GREATEST(0, 50 - (ABS(u.age - :myAge) * 2)) +
          GREATEST(0, 20 - ((6371 * 
            acos(
              cos(radians(:myLat)) * 
              cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
              cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(:myLon)) + 
              sin(radians(:myLat)) * 
              sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
            ) - 20) / 30)) +
          LEAST(30, 10 * COUNT(ti.tagName)) +
          GREATEST(-10, -1 * (ABS(:myFame - u.fameRating) / 3))
        ) AS compatibilityScore,
        m.user_id IS NOT NULL AS isMatch
      FROM
        User u
        LEFT JOIN Tags ti ON u.id = ti.user_id AND ti.tagName IN (:myInterests)
      LEFT JOIN
        Matchs m
      ON
        (u.id = m.user_id AND m.other_user_id = :userId)
      OR
        (u.id = m.other_user_id AND m.user_id = :userId)
      INNER JOIN
        UserLike ul ON u.id = ul.liked_user_id
      WHERE
        ul.user_id = :userId
        AND u.id NOT IN (
          SELECT
            ub.blocked_user_id
          FROM
            Blocked ub
          WHERE
            ub.user_id = :userId
        )
      GROUP BY
        u.id,
        u.username,
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
        m.user_id
    `;

    // Execute the query
    const [rows] = await db.query(query, {
      userId,
      myAge,
      myLat,
      myLon,
      myFame,
      myInterests: myInterests ? myInterests.split(',') : [],
    }) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users to whom likes were sent
    const users: ILove[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: ILove = {
        id: row.id,
        username: row.username,
        isOnline: row.isOnline === 1,
        firstName: row.firstName,
        age: row.age,
        gender: row.gender,
        city: row.city,
        pictures: row.pictures,
        distance: -1,
        isMatch: !!row.isMatch,
        isSuperLike: row.isSuperLike === 1,
        compatibilityScore: Math.round(Math.min(100, Math.max(0, row.compatibilityScore))),
      };

      // Push liked user object to the array
      users.push(user);
    }

    // Send the array of users to whom likes were sent as JSON response
    res.status(200).json(users);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting sent liked user information',
    });
  }
}
