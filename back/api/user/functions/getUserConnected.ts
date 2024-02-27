import { Response } from 'express';

import { ThrownError } from '../../../types/type';
import { IUserSettings } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';

export async function getUserConnected(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    const userId = (req.user?.id as number) || -1;

    if (!Number.isInteger(userId) || userId < 1) {
      console.error('Invalid user id:', userId);

      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid user id',
      });
      return;
    }

    const db = await connectToDatabase();

    const query = `
      SELECT
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.isVerified,
        u.isOnline,
        u.isComplete,
        u.lastConnection,
        u.created_at,
        u.age,
        u.gender,
        u.sexualPreferences,
        u.loc,
        u.consentLocation,
        u.city,
        u.biography,
        u.pictures,
        u.fameRating,
        t.tagName AS interestName,
        n.id AS notificationId,
        n.content AS notificationContent,
        n.redirect AS notificationRedirect,
        n.related_user_id AS notificationRelatedUserId,
        n.created_at AS notificationCreatedAt
      FROM
        User u
      LEFT JOIN
        Tags t
      ON
        u.id = t.user_id
      LEFT JOIN
        Notification n
      ON
        u.id = n.user_id
      WHERE
        u.id = ?
    `;

    // Execute the query and check the result
    const [rows] = (await db.query(query, [userId])) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      console.error('No user found with id:', userId);

      res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    // Create the user object
    const user: IUserSettings = {
      id: rows[0].id,
      isVerified: !!rows[0].isVerified,
      isOnline: !!rows[0].isOnline,
      isComplete: !!rows[0].isComplete,
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
      usersBlocked: [],
      notifications: [],
    };

    const interestsSet = new Set<string>();

    // Get all interests
    for (const row of rows) {
      if (row.interestName) {
        interestsSet.add(row.interestName);
      }
    }

    // Set interests
    user.interests = Array.from(interestsSet);

    // Get all notifications
    for (const row of rows) {
      if (
        row.notificationId &&
        !user.notifications.some((n) => n.id === row.notificationId)
      )
        user.notifications.push({
          id: row.notificationId,
          content: row.notificationContent,
          redirect: row.notificationRedirect,
          related_user_id: row.notificationRelatedUserId,
          created_at: row.notificationCreatedAt,
        });
    }

    // TODO: Get visit history
    // TODO: Get user visited
    // TODO: Get users blocked

    res.status(200).json(user);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while getting connected user infos',
    });
  }
}
