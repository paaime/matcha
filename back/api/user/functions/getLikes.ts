// Import necessary modules and types
import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { ILove, IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';

export async function getLikes(req: RequestUser, res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();

    // Query to get users who liked the current user
    const query = `
      SELECT
        u.id,
        u.firstName,
        u.isOnline,
        u.age,
        u.gender,
        u.city,
        u.pictures,
        u.fameRating
      FROM
        User u
      INNER JOIN
        UserLike ul ON u.id = ul.user_id
      WHERE
        ul.liked_user_id = ?
    `;

    // Execute the query
    const [rows] = (await db.query(query, [req.user.id])) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Create an array to store users who liked
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

      // Push liked user object to the array
      users.push(user);
    }

    // Send the array of liked users as JSON response
    res.status(200).json(users);
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
