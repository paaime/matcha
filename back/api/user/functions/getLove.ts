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

export async function getLove(req: RequestUser, res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();

    // Get my sexual preferences
    const [rowsPreferences] = (await db.query("SELECT age, loc, gender, sexualPreferences FROM User WHERE id = ?",
      [req.user.id]
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

    console.log({ myLoc, myGender, myPreferences });

    const query = `
    SELECT
      u.firstName,
      u.lastName,
      u.age,
      u.loc,
      u.city,
      u.pictures,
      u.fameRating,
      u.isOnline,
      (
        6371 * 
        acos(
          cos(radians(?)) * 
          cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
          cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(?)) + 
          sin(radians(?)) * 
          sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
        )
      ) AS distance,
      (
        (100 - ABS(u.age - ?)) + (u.fameRating / 100)
      ) AS compatibilityScore
    FROM
      User u
    WHERE
      u.id != ?
      AND u.gender = ?
      AND u.sexualPreferences = ?
      AND u.id NOT IN (
        SELECT
          ul.liked_user_id
        FROM
          UserLike ul
        WHERE
          ul.user_id = ?
      )
      AND u.id NOT IN (
        SELECT
          ul.user_id
        FROM
          UserLike ul
        WHERE
          ul.liked_user_id = ?
      )
    HAVING
      distance <= ?
      AND age >= ?
      AND age <= ?
      AND fameRating >= ?
      AND fameRating <= ?
    ORDER BY
      compatibilityScore ASC
    `;

    // Execute the query
    const [rows] = (await db.query(query, [
      myLoc,
      myLoc,
      myLoc,
      myAge,
      req.user.id,
      myPreferences,
      myGender,
      req.user.id,
      req.user.id,
      MAX_DISTANCE,
      MIN_AGE,
      MAX_AGE,
      MIN_FAME,
      MAX_FAME,
    ])) as any;

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
        city: row.city,
        pictures: row.pictures,
        distance: Math.round(row.distance),
        compatibilityScore: row.compatibilityScore,
      };

      console.log(user.firstName, user.compatibilityScore);

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
