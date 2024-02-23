import { Response } from 'express';

import { ThrownError } from '../../../types/type';
import { IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';

export async function getUserWithId(userId: number, connectedUserId: number, res: Response): Promise<undefined>{
  try {
    if (!Number.isInteger(userId) || userId < 1) {
      console.error('Invalid user id:', userId);

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id'
      });
      return;
    }

    if (!Number.isInteger(connectedUserId) || connectedUserId < 1) {
      console.error('Invalid connected user id:', connectedUserId);

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid connected user id'
      });
      return;
    }

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
        t.id AS interestId,
        t.tagName AS interestName,
        IF(m.id IS NOT NULL, true, false) AS isMatch,
        m.id AS matchId,
        IF(l.id IS NOT NULL, true, false) AS isLiked,
        IF(hl.id IS NOT NULL, true, false) AS hasLiked,
        IF(b.id IS NOT NULL, true, false) AS isBlocked,
        IF(hb.id IS NOT NULL, true, false) AS hasBlocked
      FROM
        User u
      LEFT JOIN
        Tags t
      ON
        u.id = t.user_id
      LEFT JOIN
        Matchs m
      ON
        (u.id = m.user_id AND m.other_user_id = ?)
      OR
        (u.id = m.other_user_id AND m.user_id = ?)
      LEFT JOIN
        UserLike l
      ON
        l.user_id = ? AND l.liked_user_id = u.id
      LEFT JOIN
        UserLike hl
      ON
        hl.user_id = u.id AND hl.liked_user_id = ?
      LEFT JOIN
        Blocked b
      ON
        b.user_id = ? AND b.blocked_user_id = u.id
      LEFT JOIN
        Blocked hb
      ON
        hb.user_id = u.id AND hb.blocked_user_id = ?
      WHERE
        u.id = ?
    `;

    // Execute the query and check the result
    const [rows] = await db.query(query, [connectedUserId, connectedUserId, connectedUserId, userId, connectedUserId, userId, userId]) as any;

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
    const user: IUser = {
      id: rows[0].id,
      isOnline: rows[0].isOnline === 1,
      lastConnection: rows[0].lastConnection,
      created_at: rows[0].created_at,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      age: rows[0].age,
      gender: rows[0].gender,
      sexualPreferences: rows[0].sexualPreferences,
      city: rows[0].city,
      biography: rows[0].biography,
      pictures: rows[0].pictures,
      fameRating: rows[0].fameRating,
      isMatch: !!rows[0].isMatch,
      matchId: rows[0].matchId || undefined,
      isLiked: !!rows[0].isLiked,
      hasLiked: !!rows[0].hasLiked,
      isBlocked: !!rows[0].isBlocked,
      hasBlocked: !!rows[0].hasBlocked,
      isVerified: !!rows[0].isVerified,
      interests: []
    };

    // Get all interests
    for (const row of rows) {
      if (row.interestId && row.interestName) {
        user.interests.push(row.interestName);
      }
    }

    // Calculate distance
    user.distance = Math.floor(Math.random() * 100) + 1; // TODO Random for now

    res.status(200).json(user);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    console.error({ code, message });
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while getting user infos',
    });
  }
}
