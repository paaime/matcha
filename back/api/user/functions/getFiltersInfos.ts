// Import necessary modules and types
import { Response } from 'express';
import { Filters, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';

export async function getFiltersInfos(req: RequestUser, res: Response): Promise<void> {
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
      'SELECT sexualPreferences FROM User WHERE id = ?',
      [userId]
    )) as any;

    if (!rowsPreferences || rowsPreferences.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const mySexualPreferences = rowsPreferences[0].sexualPreferences;

    // Get all interests from Tags table related to user_id with the same sexual preferences
    const [rows] = (await db.query(
      'SELECT tagName FROM Tags WHERE user_id IN (SELECT id FROM User WHERE gender = ?) GROUP BY tagName',
      [mySexualPreferences]
    )) as any;

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
