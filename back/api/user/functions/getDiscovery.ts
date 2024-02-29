import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { IDiscovery } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

const MAX_DAYS = 7;

export async function getDiscovery(
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

    // Get my sexual preferences
    const [rowsPreferences] = (await db.query(
      'SELECT loc, consentLocation FROM User WHERE id = ?',
      [userId]
    )) as any;

    if (!rowsPreferences || rowsPreferences.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const myConsent = rowsPreferences[0].consentLocation;
    const myLoc = rowsPreferences[0].loc;

    const myLat = myConsent ? myLoc?.split(',')[0] : 0;
    const myLon = myConsent ? myLoc?.split(',')[1] : 0;

    const query = `
      SELECT
        u.id,
        u.username,
        u.firstName,
        u.age,
        u.loc,
        u.consentLocation,
        u.city,
        u.pictures,
        u.isOnline,
        u.isVerified,
        u.isComplete,
        IF(u.consentLocation = 1, (
          6371 * 
          acos(
            cos(radians(:myLat)) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(:myLon)) + 
            sin(radians(:myLat)) * 
            sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
          )
        ), -1) AS distance
      FROM
        User u
      WHERE
        u.id != :userId
        AND u.isVerified = 1
        AND u.isComplete = 1
        AND u.fameRating >= 0
        AND u.created_at >= DATE_SUB(NOW(), INTERVAL ${MAX_DAYS} DAY)
        AND u.id NOT IN (
          SELECT
            ub.blocked_user_id
          FROM
            Blocked ub
          WHERE
            ub.user_id = :userId
        )
      ORDER BY
        created_at DESC
      LIMIT 10
    `;

    // Execute the query
    const [rows] = (await db.query(query, {
      userId,
      myLat,
      myLon
    })) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users
    const users: IDiscovery[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: IDiscovery = {
        id: row.id,
        username: row.username,
        isOnline: row.isOnline,
        firstName: row.firstName,
        age: row.age,
        city: row.city || '',
        pictures: row.pictures || '',
        distance: myConsent ? Math.round(row.distance) : -1,
      };

      // Push user object to the array
      users.push(user);
    }

    // Send the array of users as JSON response
    res.status(200).json(users);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting user discovery information',
    });
  }
}
