import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove, IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';

const MIN_AGE = 18;
const MAX_AGE = 99;

const MIN_FAME = 0;
const MAX_FAME = 1000;

const MAX_DISTANCE = 10000e3; // 10 000 km

export async function getLove(req: RequestUser, res: Response, customFilter: boolean = false): Promise<void> {
  try {
    const userId = req.user.id;

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
      'SELECT age, loc, consentLocation, gender, sexualPreferences FROM User WHERE id = ?',
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
    const myAge = rowsPreferences[0].age;
    const myLoc = rowsPreferences[0].loc;
    const myGender = rowsPreferences[0].gender;
    const myPreferences = rowsPreferences[0].sexualPreferences;

    const myLat = myConsent ? myLoc?.split(',')[0] : 0;
    const myLon = myConsent ? myLoc?.split(',')[1] : 0;

    const query = `
      SELECT
        u.id,
        u.firstName,
        u.age,
        u.loc,
        u.consentLocation,
        u.city,
        u.pictures,
        u.fameRating,
        u.isOnline,
        u.isVerified,
        IF(u.consentLocation = 1 AND :myLat != 0 AND :myLon != 0 AND u.loc != '', (
          6371 * 
          acos(
            cos(radians(:myLat)) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(:myLon)) + 
            sin(radians(:myLat)) * 
            sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
          )
        ), -1) AS distance,
        (
          (100 - ABS(u.age - :myAge)) + (u.fameRating / 100)
        ) AS compatibilityScore
      FROM
        User u
      WHERE
        u.id != :userId
        AND u.isVerified = 1
        AND u.isComplete = 1
        AND u.gender = :myPreferences
        AND u.sexualPreferences = :myGender
        AND u.id NOT IN (
          SELECT
            ul.liked_user_id
          FROM
            UserLike ul
          WHERE
            ul.user_id = :userId
        )
        AND u.id NOT IN (
          SELECT
            ul.user_id
          FROM
            UserLike ul
          WHERE
            ul.liked_user_id = :userId
        )
        AND u.id NOT IN (
          SELECT
            ub.blocked_user_id
          FROM
            Blocked ub
          WHERE
            ub.user_id = :userId
        )
        AND u.id NOT IN (
          SELECT
            ub.user_id
          FROM
            Blocked ub
          WHERE
            ub.blocked_user_id = :userId
        )
        AND u.id NOT IN (
          SELECT
            r.reported_user_id
          FROM
            Reported r
          WHERE
            r.user_id = :userId
        )
        AND u.id NOT IN (
          SELECT
            r.user_id
          FROM
            Reported r
          WHERE
            r.reported_user_id = :userId
        )
      HAVING
        distance <= :maxDistance
        AND age >= :minAge
        AND age <= :maxAge
        AND fameRating >= :minFame
        AND fameRating <= :maxFame
      ORDER BY
        compatibilityScore ASC
    `;

    // Execute the query
    const [rows] = (await db.query(query, {
      myLat,
      myLon,
      myAge,
      userId,
      myGender,
      myPreferences,
      maxDistance: MAX_DISTANCE,
      minAge: MIN_AGE,
      maxAge: MAX_AGE,
      minFame: MIN_FAME,
      maxFame: MAX_FAME,
    })) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users
    const users: ILove[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: ILove = {
        id: row.id,
        isOnline: row.isOnline,
        firstName: row.firstName,
        age: row.age,
        gender: row.gender,
        city: row.city || '',
        pictures: row.pictures || '',
        distance: myConsent ? Math.round(row.distance) : -1,
        compatibilityScore: row.compatibilityScore,
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

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while getting user information',
    });
  }
}
