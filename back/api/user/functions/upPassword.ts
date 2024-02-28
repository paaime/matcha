import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { passwordRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upPassword(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    const user_id = getAuthId(req);

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    // Get infos from body
    const { current, newPass } = req.body;

    if (!passwordRegex.test(newPass)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid new password',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if the user is Google
    const googleQuery = 'SELECT isGoogle FROM User WHERE id = ?';
    const [googleResult] = (await db.query(googleQuery, [user_id])) as any;

    if (googleResult && googleResult.length > 0) {
      const { isGoogle } = googleResult[0];

      // Close the connection
      db.end();

      if (isGoogle) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Google user cannot update password',
        });
        return;
      }
    }

    // Check if the email is already used
    const query = 'SELECT passwordHashed FROM User WHERE id = ?';
    const [rows] = (await db.execute(query, [user_id])) as any;

    if (rows.length === 0) {
      // Close the connection
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    const user = rows[0];

    if (!bcrypt.compareSync(current, user.passwordHashed)) {
      // Close the connection
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid password',
      });
      return;
    }

    // Update the user's password
    const passHash = await bcrypt.hash(newPass, 10);

    const updateQuery = 'UPDATE User SET passwordHashed = ? WHERE id = ?';
    await db.query(updateQuery, [passHash, user_id]);

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      updated: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while updating the password',
    });
  }
}
