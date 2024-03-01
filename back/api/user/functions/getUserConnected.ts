import { Response } from 'express';

import { Notification, ThrownError } from '../../../types/type';
import { IUserList, IUserSettings } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function getUserConnected(
  req: RequestUser,
  res: Response
): Promise<undefined> {
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

    const query = `
      SELECT
        u.id,
        u.username,
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
        n.isRead AS notificationIsRead,
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

    if (!rows || rows.length === 0) {
      // Close the connection
      await db.end();

      console.error('No user found with id:', userId);

      res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    const queryHistory = `
      SELECT 
        User.id,
        User.username,
        User.firstName,
        User.age,
        User.pictures,
        History.created_at
      FROM
        History
      JOIN
        User ON User.id = History.visited_user_id
      WHERE
        History.user_id = ?
      ORDER BY
        History.created_at DESC;
    `;

    const [history] = await db.query(queryHistory, [userId]) as any;

    const queryVisited = `
      SELECT 
        User.id,
        User.username,
        User.firstName,
        User.age,
        User.pictures,
        History.created_at
      FROM
        History
      JOIN
        User ON User.id = History.user_id
      WHERE
        History.visited_user_id = ?
      ORDER BY
        History.created_at DESC;
    `;

    const [visited] = await db.query(queryVisited, [userId]) as any;

    const blockedQuery = `
      SELECT 
        User.id,
        User.username,
        User.firstName,
        User.age,
        User.pictures,
        Blocked.created_at
      FROM
        Blocked
      JOIN
        User ON User.id = Blocked.blocked_user_id
      WHERE
        Blocked.user_id = ?
      ORDER BY
        Blocked.created_at DESC;
    `;

    const [blocked] = await db.query(blockedQuery, [userId]) as any;

    // Close the connection
    await db.end();

    // Remove history users with same id
    const historyIds = new Set<number>();
    const historyFiltered = [] as IUserList[];

    for (const user of history) {
      if (!historyIds.has(user.id)) {
        historyIds.add(user.id);
        historyFiltered.push(user);
      }
    }

    // Remove visited users with same id
    const visitedIds = new Set<number>();
    const visitedFiltered = [] as IUserList[];

    for (const user of visited) {
      if (!visitedIds.has(user.id)) {
        visitedIds.add(user.id);
        visitedFiltered.push(user);
      }
    }

    // Create the user object
    const user: IUserSettings = {
      id: rows[0].id,
      username: rows[0].username,
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
      interests: [], // Filled below
      visitHistory: historyFiltered || [],
      userVisited: visitedFiltered || [],
      usersBlocked: blocked as IUserList[] || [],
      notifications: [], // Filled below
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
    const notifications: Notification[] = [];

    for (const row of rows) {
      if (
        row.notificationId &&
        !user.notifications.some((n) => n.id === row.notificationId)
      )
        notifications.push({
          id: row.notificationId,
          isRead: !!row.notificationIsRead,
          content: row.notificationContent,
          redirect: row.notificationRedirect,
          related_user_id: row.notificationRelatedUserId,
          created_at: row.notificationCreatedAt,
        });
    }

    // Remove duplicates ids
    const notificationsIds = new Set<number>();

    for (const notification of notifications) {
      if (!notificationsIds.has(notification.id)) {
        notificationsIds.add(notification.id);
      }
    }

    const notificationsFiltered: Notification[] = [];

    for (const id of notificationsIds) {
      const notification = notifications.find((n) => n.id === id);

      if (notification && !notificationsFiltered.some((n) => n.id === id)) {
        notificationsFiltered.push(notification);
      }
    }

    // Set notifications sorted by id
    user.notifications = notificationsFiltered.sort((a, b) => b.id - a.id);

    res.status(200).json(user);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting connected user infos',
    });
  }
}
