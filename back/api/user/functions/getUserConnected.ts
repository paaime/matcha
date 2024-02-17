import { Response } from 'express';

import { ThrownError } from '../../../types/type';
import { IUser, IUserSettings } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';

export async function getUserConnected(userId: number, res: Response): Promise<undefined>{
  try {
    const db = await connectToDatabase();

    const query = `
      SELECT
        u.id,
        u.firstName,
        u.lastName,
        u.age,
        u.gender,
        u.sexualPreferences,
        u.city,
        u.biography,
        u.pictures,
        u.fameRating,
        t.tagName AS interestName
      FROM
        User u
      LEFT JOIN
        Tags t
      ON
        u.id = t.user_id
      WHERE
        u.id = ?
    `;

    // Execute the query and check the result
    const [rows] = await db.query(query, [userId]) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      console.error('No user found with id:', userId);

      res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
      return;
    }

    // Create the user object
    const user: IUserSettings = {
      id: rows[0].id,
      isVerified: !!rows[0].isVerified,
      isOnline: !!rows[0].isOnline,
      lastConnection: rows[0].lastConnection,
      created_at: rows[0].created_at,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      email: rows[0].email,
      age: rows[0].age,
      gender: rows[0].gender,
      sexualPreferences: rows[0].sexualPreferences,
      loc: rows[0].loc,
      city: rows[0].city,
      consentLocation: !!rows[0].consentLocation,
      biography: rows[0].biography,
      pictures: rows[0].pictures,
      fameRating: rows[0].fameRating,
      interests: [],
      visitHistory: [],
      userVisited: [],
      usersBlocked: []
    };

    // Get all interests
    for (const row of rows) {
      if (row.interestName) {
        user.interests.push(row.interestName);
      }
    }

    // TODO: Get visit history
    // TODO: Get user visited
    // TODO: Get users blocked

    res.status(200).json(user);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    console.error({ code, message });
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while getting connected user infos',
    });
  }
}
