// Import necessary modules and types
import { Response } from 'express';
import { Filters, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { getMaxAge, getMaxDistance, getMaxFame, getMinAge, getMinFame } from './getLove';

export async function getFiltersInfos(req: RequestUser, res: Response): Promise<void> {
  try {
    const userId = getAuthId(req);

    if (!userId || !Number.isInteger(userId) || userId < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    let minAge = getMinAge(true, req.query.minAge as string);
    let maxAge = getMaxAge(true, req.query.maxAge as string);
    let minFame = getMinFame(true, req.query.minFame as string);
    let maxFame = getMaxFame(true, req.query.maxFame as string);
    let maxDistance = getMaxDistance(
      true,
      req.query.maxDistance as string
    );

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
    const myAge = rowsPreferences[0].age;
    const myLoc = rowsPreferences[0].loc;
    const myGender = rowsPreferences[0].gender;
    const myPreferences = rowsPreferences[0].sexualPreferences;

    const myLat = myLoc?.split(',')[0];
    const myLon = myLoc?.split(',')[1];

    // Get all interests from Tags table related to user_id with the same sexual preferences
    const query = `
      SELECT
        Tags.tagName
      FROM
        User
      JOIN
        Tags ON User.id = Tags.user_id
      WHERE
        User.id != :userId
        AND User.isVerified = 1
        AND User.isComplete = 1
        AND User.gender = :myPreferences
        AND User.sexualPreferences = :myGender
        AND User.id NOT IN (
          SELECT
            ul.liked_user_id
          FROM
            UserLike ul
          WHERE
            ul.user_id = :userId
        )
        AND User.id NOT IN (
          SELECT
            ul.user_id
          FROM
            UserLike ul
          WHERE
            ul.liked_user_id = :userId
        )
        AND User.id NOT IN (
          SELECT
            ub.blocked_user_id
          FROM
            Blocked ub
          WHERE
            ub.user_id = :userId
        )
        AND User.id NOT IN (
          SELECT
            ub.user_id
          FROM
            Blocked ub
          WHERE
            ub.blocked_user_id = :userId
        )
        AND User.age >= :minAge
        AND User.age <= :maxAge
        AND User.fameRating >= :minFame
        AND User.fameRating <= :maxFame
        AND (6371 * acos(cos(radians(:myLat)) * cos(radians(SUBSTRING_INDEX(User.loc, ',', 1))) * cos(radians(SUBSTRING_INDEX(User.loc, ',', -1)) - radians(:myLon)) + sin(radians(:myLat)) * sin(radians(SUBSTRING_INDEX(User.loc, ',', 1))))) <= :maxDistance
      GROUP BY
        Tags.tagName;
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

    // Get min and max age and fameRating from User table
    const [rowsMinMax] = (await db.query(
      'SELECT MIN(age) as minAge, MAX(age) as maxAge, MIN(fameRating) as minFameRating, MAX(fameRating) as maxFameRating FROM User'
    )) as any;

    const interests: string[] = [];

    // Iterate over the rows and create an array of interests
    for (const row of rows) {
      interests.push(row.tagName);
    }

    // Close the connection
    await db.end();

    const filters: Filters = {
      interests,
      minAge: rowsMinMax[0].minAge || 18,
      maxAge: rowsMinMax[0].maxAge || 100,
      minFameRating: rowsMinMax[0].minFameRating || 0,
      maxFameRating: rowsMinMax[0].maxFameRating || 500,
    };

    // Send the array of liked users as JSON response
    res.status(200).json(filters);
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
