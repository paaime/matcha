import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { interestsList } from '../../../types/list';
import { getAuthId } from '../../../middlewares/authCheck';

export const getMinAge = (customFilter: boolean, newValue: string) => {
  const defaultValue = 18;

  if (customFilter === false) {
    return defaultValue;
  }

  const intValue = parseInt(newValue, 10);

  if (Number.isInteger(intValue) && intValue >= 18 && intValue <= 100) {
    return Math.abs(intValue);
  }

  return defaultValue;
};

export const getMaxAge = (customFilter: boolean, newValue: string) => {
  const defaultValue = 99;

  if (customFilter === false) {
    return defaultValue;
  }

  const intValue = parseInt(newValue, 10);

  if (Number.isInteger(intValue) && intValue >= 18 && intValue <= 100) {
    return Math.abs(intValue);
  }

  return defaultValue;
};

export const getMinFame = (customFilter: boolean, newValue: string) => {
  const defaultValue = 0;

  if (customFilter === false) {
    return defaultValue;
  }

  const intValue = parseInt(newValue, 10);

  if (Number.isInteger(intValue) && intValue >= 0 && intValue <= 100000) {
    return Math.abs(intValue);
  }

  return defaultValue;
};

export const getMaxFame = (customFilter: boolean, newValue: string) => {
  const defaultValue = 400;

  if (customFilter === false) {
    return defaultValue;
  }

  const intValue = parseInt(newValue, 10);

  if (Number.isInteger(intValue) && intValue >= 0 && intValue <= 100000) {
    return Math.abs(intValue);
  }

  return defaultValue;
};

export const getMaxDistance = (customFilter: boolean, newValue: string) => {
  const defaultValue = 5; // 5km

  if (customFilter === false) {
    return 25;
  }

  const intValue = parseInt(newValue, 10);

  if (!Number.isInteger(intValue) || intValue < 1) {
    return defaultValue;
  }

  if (intValue === 0) {
    return 10;
  } else if (intValue === 10) {
    return 20;
  } else if (intValue === 50) {
    return 100;
  } else if (intValue === 100) {
    return 500000; // 500 000
  }

  return defaultValue;
};

export async function getLove(
  req: RequestUser,
  res: Response,
  customFilter: boolean = false
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

    let minAge = getMinAge(customFilter, req.query.minAge as string);
    let maxAge = getMaxAge(customFilter, req.query.maxAge as string);
    let minFame = getMinFame(customFilter, req.query.minFame as string);
    let maxFame = getMaxFame(customFilter, req.query.maxFame as string);
    let maxDistance = getMaxDistance(
      customFilter,
      req.query.maxDistance as string
    );

    let interests: string[] = [];

    if (minAge > maxAge) {
      const temp = minAge;
      minAge = maxAge;
      maxAge = temp;
    }

    if (minFame > maxFame) {
      const temp = minFame;
      minFame = maxFame;
      maxFame = temp;
    }

    if (req.query.interests) {
      interests = (req.query.interests as string).split(',');

      // Remove duplicates
      interests = Array.from(new Set(interests));

      // Remove empty strings
      interests = interests.filter((interest) => interest.length > 0);

      // Remove interests that not match interests regex
      interests = interests.filter((interest) => interestsList.includes(interest));
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

    const myLat = myLoc?.split(',')[0];
    const myLon = myLoc?.split(',')[1];

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
        IF(:myLat != 0 AND :myLon != 0 AND u.loc != '', (
          6371 * 
          acos(
            cos(radians(:myLat)) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(:myLon)) + 
            sin(radians(:myLat)) * 
            sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
          )
        ), -1) AS estimatedDistance,
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
        ${interests.length > 0 ? `AND u.id IN (
          SELECT
            ti.user_id
          FROM
            Tags ti
          WHERE
            ti.tagName IN (${interests.map((interest) => "'" + interest + "'").join(',')})
        )` : ''}
      HAVING
        estimatedDistance <= :maxDistance
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
      maxDistance,
      minAge,
      maxAge,
      minFame,
      maxFame
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
        compatibilityScore: Math.min(100, Math.max(0, row.compatibilityScore)),
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
