import { Response } from 'express';

import { Notification, ThrownError } from '../../../types/type';
import { IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';
import { addVisit } from '../../../utils/visit';
import { updateFame } from '../../../utils/fame';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { usernameRegex } from '../../../types/regex';

export async function getUserWithId(
  username: string,
  connectedUserId: number,
  res: Response
): Promise<undefined> {
  try {
    if (!username || !usernameRegex.test(username)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid username',
      });
      return;
    }

    if (!Number.isInteger(connectedUserId) || connectedUserId < 1) {
      // console.error('Invalid connected user id:', connectedUserId);

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid connected user id',
      });
      return;
    }

    const db = await connectToDatabase();

    // Get user infos
    const userInfos = 'SELECT id, loc, consentLocation FROM User WHERE id = ?';
    const [rowsUserInfos] = (await db.query(userInfos, [
      connectedUserId,
    ])) as any;

    if (!rowsUserInfos || rowsUserInfos.length === 0) {
      // console.error('No user found with id:', connectedUserId);

      db.end();

      res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    const connectedUserConsent = rowsUserInfos[0].consentLocation;

    const lat = connectedUserConsent ? rowsUserInfos[0].loc?.split(',')[0] : 0;
    const lon = connectedUserConsent ? rowsUserInfos[0].loc?.split(',')[1] : 0;

    const query = `
      SELECT
        u.id,
        u.username,
        u.firstName,
        u.lastName,
        u.age,
        u.gender,
        u.sexualPreferences,
        u.loc,
        u.consentLocation,
        u.city,
        u.biography,
        u.pictures,
        u.fameRating,
        u.isOnline,
        u.isVerified,
        u.lastConnection,
        u.created_at,
        u.isComplete,
        t.tagName AS interestName,
        IF(u.consentLocation = 1 AND :lat != 0 AND :lon != 0 AND u.loc != '', (
          6371 * 
          acos(
            cos(radians(:lat)) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', 1))) * 
            cos(radians(SUBSTRING_INDEX(u.loc, ',', -1)) - radians(:lon)) + 
            sin(radians(:lat)) * 
            sin(radians(SUBSTRING_INDEX(u.loc, ',', 1)))
          )
        ), -1) AS distance,
        IF(l.id IS NOT NULL, true, false) AS isLiked,
        IF(l.id IS NOT NULL, l.created_at, null) AS likeTime,
        IF(hl.id IS NOT NULL, true, false) AS hasLiked,
        IF(hl.id IS NOT NULL, hl.created_at, null) AS hasLikeTime,
        IF(b.id IS NOT NULL, true, false) AS isBlocked,
        IF(hb.id IS NOT NULL, true, false) AS hasBlocked,
        m.user_id IS NOT NULL AS isMatch,
        m.id AS matchId,
        m.created_at AS matchTime,
        IF(
          (SELECT COUNT(*) FROM UserLike WHERE user_id = :connectedUserId AND liked_user_id = :userId AND isSuperLike = 1) > 0,
          true,
          false
        ) AS isSuperLike,
        IF(
          (SELECT COUNT(*) FROM UserLike WHERE user_id = :userId AND liked_user_id = :connectedUserId AND isSuperLike = 1) > 0,
          true,
          false
        ) AS hasSuperLike
        FROM
          User u
        LEFT JOIN
          Matchs m
        ON
          (m.user_id = :connectedUserId AND m.other_user_id = :userId)
        OR
          (m.other_user_id = :connectedUserId AND m.user_id = :userId)
      LEFT JOIN
        Tags t
      ON
        u.id = t.user_id
      LEFT JOIN
        UserLike l
      ON
        l.user_id = :connectedUserId AND l.liked_user_id = u.id
      LEFT JOIN
        UserLike hl
      ON
        hl.user_id = u.id AND hl.liked_user_id = :connectedUserId
      LEFT JOIN
        Blocked b
      ON
        b.user_id = :connectedUserId AND b.blocked_user_id = u.id
      LEFT JOIN
        Blocked hb
      ON
        hb.user_id = u.id AND hb.blocked_user_id = :connectedUserId
      WHERE
        u.username = :username
        AND u.isVerified = 1
        AND u.isComplete = 1
    `;

    // Execute the query and check the result
    const [rows] = (await db.query(query, {
      lat,
      lon,
      username,
      connectedUserId,
    })) as any;

    let isLiked = false;
    let isSuperLike = false;
    let isLikedTime = null;
    let hasLiked = false;
    let hasSuperLike = false;
    let hasLikedTime = null;

    // Get my like infos
    const [rowsMyLike] = (await db.query('SELECT * FROM UserLike WHERE user_id = ? AND liked_user_id = ?', [
      connectedUserId,
      rows[0].id,
    ])) as any;

    if (rowsMyLike && rowsMyLike.length > 0) {
      isLiked = true;
      isSuperLike = !!rowsMyLike[0].isSuperLike;
      isLikedTime = rowsMyLike[0].created_at;
    }

    // Get his like infos
    const [rowsHisLike] = (await db.query('SELECT * FROM UserLike WHERE user_id = ? AND liked_user_id = ?', [
      rows[0].id,
      connectedUserId,
    ])) as any;

    if (rowsHisLike && rowsHisLike.length > 0) {
      hasLiked = true;
      hasSuperLike = !!rowsHisLike[0].isSuperLike;
      hasLikedTime = rowsHisLike[0].created_at;
    }

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      // console.error('No user found with username:', username);

      res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    const userId = rows[0].id;

    if (userId !== connectedUserId) {
      // Add Trace
      await addVisit(connectedUserId, userId);
      
      // Update fame
      await updateFame(userId, 'newVisit');
    }

    // Create the user object
    const user: IUser = {
      id: rows[0].id,
      username: rows[0].username,
      isOnline: rows[0].isOnline === 1,
      lastConnection: rows[0].lastConnection,
      created_at: rows[0].created_at,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      age: rows[0].age,
      gender: rows[0].gender,
      sexualPreferences: rows[0].sexualPreferences,
      loc: rows[0].loc,
      city: rows[0].city,
      consentLocation: !!rows[0].consentLocation,
      biography: rows[0].biography,
      pictures: rows[0].pictures,
      fameRating: rows[0].fameRating,
      isMatch: !!rows[0].isMatch,
      matchId: rows[0].matchId || undefined,
      matchTime: rows[0].matchTime || undefined,
      isLiked: isLiked,
      isSuperLike: isSuperLike,
      isLikeTime: isLikedTime || undefined,
      hasLiked: hasLiked,
      hasSuperLike: hasSuperLike,
      hasLikeTime: hasLikedTime || undefined,
      isBlocked: !!rows[0].isBlocked,
      hasBlocked: !!rows[0].hasBlocked,
      isVerified: !!rows[0].isVerified,
      distance: connectedUserConsent ? Math.round(rows[0].distance) : -1,
      interests: []
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

    // Send notifications
    if (userId !== connectedUserId) {
      await sendNotification(userId.toString(), {
        content: 'Someone visited your profile',
        redirect: '/settings',
        related_user_id: connectedUserId
      } as Notification);
    }

    res.status(200).json(user);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while getting user infos',
    });
  }
}
