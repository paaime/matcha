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
  const db = await connectToDatabase();

  if (!db) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Database connection error',
    });
    return;
  }

  try {
    // Get infos from body
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid body',
      });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid email',
      });
      return;
    }

    if (!token || token.length < 5 || token.length > 100) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid token',
      });
      return;
    }

    // Check new password
    if (!passwordRegex.test(password)) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Password is not valid',
      });
      return;
    }


    // Check if the user is Google
    const googleQuery = 'SELECT isGoogle FROM User WHERE email = ?';
    const [googleResult] = (await db.query(googleQuery, [email])) as any;

    if (googleResult && googleResult.length > 0 && googleResult[0].isGoogle) {
      res.status(403).json({
        error: 'Forbidden',
        message: "Google user can't do that",
      });
      return;
    }

    // Check if the email is already used
    const emailQuery = 'SELECT id, emailToken FROM User WHERE email = ?';
    const [emailResult] = (await db.query(emailQuery, [email])) as any;

    if (!emailResult || emailResult.length === 0) {
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
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
      return;
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password
    const updateQuery = 'UPDATE User SET passwordHashed = ?, emailToken = ? WHERE id = ?';
    (await db.query(updateQuery, [hashedPassword, null, user_id])) as any;

    res.status(200).json({
      user_id,
      reset: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    res.status(500).json({
      error: 'Server error',
      message:
        'An error occurred while resetting the password. Please try again later.',
    });
  } finally {
    // Close the connection
    db.end();
  }
}
