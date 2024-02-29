import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upEmail(
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
    const { email } = req.body;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid email',
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
          message: 'Google user cannot update email',
        });
        return;
      }
    }

    // Check if the email is already used
    const emailQuery = 'SELECT id, email FROM User WHERE email = ?';
    const [emailResult] = (await db.query(emailQuery, [email, user_id])) as any;

    if (emailResult && emailResult.length > 0) {
      const { id } = emailResult[0];

      // Close the connection
      db.end();

      if (id === user_id) {
        res.status(400).json({
          user_id,
          updated: false,
        });
        return;
      } else {
        res.status(400).json({
          error: 'Bad request',
          message: 'Email already used',
        });
        return;
      }
    }

    // Update the user's email
    const updateQuery = 'UPDATE User SET email = ? WHERE id = ?';
    await db.query(updateQuery, [email, user_id]);

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

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while updating the email',
    });
  }
}
