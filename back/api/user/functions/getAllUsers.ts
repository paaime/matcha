import { Response } from 'express';

import { ThrownError } from '../../../types/type';
import { IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';

export async function getAllUsers(res: Response): Promise<void> {
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
        u.loc,
        u.city,
        u.consentLocation,
        u.biography,
        u.pictures,
        u.fameRating,
        u.isComplete,
        t.id AS interestId,
        t.tagName AS interestName
      FROM
        User u
      LEFT JOIN
        Tags t
      ON
        u.id = t.user_id
      WHERE
        u.isComplete = 1
    `;

    // Execute the query
    const [rows] = (await db.query(query)) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      console.error('No users found');

      res.status(404).json({
        error: 'Not found',
        message: 'No users found',
      });
      return;
    }

    // Create an array to store users
    const users: IUser[] = [];

    // Iterate over the rows and create user objects
    for (const row of rows) {
      const user: IUser = {
        id: row.id,
        isOnline: row.isOnline === 1,
        lastConnection: row.lastConnection,
        created_at: row.created_at,
        firstName: row.firstName,
        lastName: row.lastName,
        age: row.age,
        gender: row.gender,
        sexualPreferences: row.sexualPreferences,
        loc: row.loc,
        city: row.city,
        consentLocation: !!row.consentLocation,
        biography: row.biography,
        pictures: row.pictures,
        fameRating: row.fameRating,
        isMatch: !!row.isMatch,
        matchId: row.matchId || undefined,
        isLiked: !!row.isLiked,
        hasLiked: !!row.hasLiked,
        isBlocked: !!row.isBlocked,
        hasBlocked: !!row.hasBlocked,
        isVerified: !!row.isVerified,
        interests: [],
      };

      // Push user object to the array
      users.push(user);
    }

    // Iterate over the rows again to get interests
    for (const row of rows) {
      const user = users.find((u) => u.id === row.id);
      if (user && row.interestId && row.interestName) {
        user.interests.push(row.interestName);
      }
    }

    // Calculate distance for each user (random for now)
    for (const user of users) {
      user.distance = Math.floor(Math.random() * 100) + 1;
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
