import { IUser } from '../../../types/user';
import { connectToDatabase } from '../../../utils/db';

export async function getUserWithId(userId: number): Promise<IUser | null>{
  const connectedUserId = 2; // TODO get from request auth

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

    if (!rows || rows.length === 0) {
      console.error('No user found with id:', userId);

      db.end();
      return null;
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
      isMatch: rows[0].isMatch === 1,
      matchId: rows[0].matchId || undefined,
      isLiked: rows[0].isLiked === 1,
      hasLiked: rows[0].hasLiked === 1,
      isBlocked: rows[0].isBlocked === 1,
      hasBlocked: rows[0].hasBlocked === 1,
      isVerified: rows[0].isVerified === 1,
      interests: []
    };

    // Get all interests
    for (const row of rows) {
      if (row.interestId && row.interestName) {
        user.interests.push({ id: row.interestId, name: row.interestName });
      }
    }

    // Calculate distance
    user.distance = Math.floor(Math.random() * 100) + 1; // ! Random for now

    // Close the connection
    await db.end();

    return user;
  } catch (error) {
    console.error('Error while getting user with ID', userId, ':', error);
    return null;
  }
}
