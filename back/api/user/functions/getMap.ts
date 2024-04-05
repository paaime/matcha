import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { IMapUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function getMapUsers(
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

    if (!db) {
      res.status(400).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    // Get my preferences
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

    // Return error if user has not consented to location
    if (!rowsPreferences[0].consentLocation) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'User has not consented to location',
      });
      return;
    }

    const query = `
      SELECT
        u.id,
        u.username,
        u.firstName,
        u.loc,
        u.pictures,
        u.isOnline
      FROM
        User u
      WHERE
        u.isVerified = 1
        AND u.isComplete = 1
        AND u.loc IS NOT NULL
        AND u.consentLocation = 1
      ORDER BY
        created_at DESC
    `;

    // Execute the query
    const [rows] = (await db.query(query, { userId })) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users
    const users: IMapUser[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      if (!row.loc || !row.loc.includes(',')) {
        continue;
      }

      const loc = row.loc.split(',');

      const user: IMapUser = {
        id: row.id,
        username: row.username,
        isOnline: row.isOnline,
        firstName: row.firstName,
        pictures: row.pictures || '',
        loc
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

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting map users',
    });
  }
}
