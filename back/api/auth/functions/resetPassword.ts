import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { emailRegex, passwordRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';

export async function resetPassword(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    // Get infos from body
    const { email, token, password } = req.body;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid email',
      });
      return;
    }

    if (!token || token.length < 5 || token.length > 100) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid token',
      });
      return;
    }

    // Check new password
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Password is not valid',
      });
      return;
    }

    const db = await connectToDatabase();

    // Check if the user is Google
    const googleQuery = 'SELECT isGoogle FROM User WHERE email = ?';
    const [googleResult] = (await db.query(googleQuery, [email])) as any;

    if (googleResult && googleResult.length > 0) {
      const { isGoogle } = googleResult[0];

      // Close the connection
      db.end();

      if (isGoogle) {
        res.status(400).json({
          error: 'Bad request',
          message: "Google user can't do that",
        });
        return;
      }
    }

    // Check if the email is already used
    const emailQuery = 'SELECT id, emailToken FROM User WHERE email = ?';
    const [emailResult] = (await db.query(emailQuery, [email])) as any;

    if (!emailResult || emailResult.length === 0) {
      // Close the connection
      await db.end();

      res.status(404).json({
        error: 'Email not found',
        message: 'Email not found',
      });
      return;
    }

    const user_id = emailResult[0].id;
    const emailToken = emailResult[0].emailToken;

    // Verify token
    const validToken = bcrypt.compareSync(token, emailToken);

    if (!validToken) {
      // Close the connection
      await db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid token',
      });
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password
    const updateQuery =
      'UPDATE User SET passwordHashed = ?, emailToken = ? WHERE id = ?';
    (await db.query(updateQuery, [hashedPassword, null, user_id])) as any;

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      reset: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message:
        'An error occurred while resetting the password. Please try again later.',
    });
  }
}
