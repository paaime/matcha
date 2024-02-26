// Import necessary modules and types
import { Response } from 'express';
import { Filters, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';

export async function getFiltersInfos(res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();

    // Get all interests from Tags table and min/max age and fameRating from User table
    const [rows] = (await db.query('SELECT DISTINCT tagName FROM Tags')) as any;

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
