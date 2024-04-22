import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { logger } from '../../../utils/logger';

export async function upEmail(
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

    if (!email) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Missing email',
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

    // Check if the user is Google
    const userQuery = 'SELECT id, isGoogle FROM User WHERE id = ? LIMIT 1';
    const [usrResult] = (await db.query(userQuery, [user_id])) as any;
    

    // Check if user exists
    if (!usrResult || usrResult.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    // Check if the user is Google
    const isGoogle = usrResult[0].isGoogle;
    if (isGoogle === 1) {
      res.status(400).json({
        error: 'Bad request',
        message: "Google user can't do that",
      });
      return;
    }

    // Check if the email is already used
    const emailQuery = 'SELECT id, email FROM User WHERE email = ? LIMIT 1';
    const [emailResult] = (await db.query(emailQuery, [email, user_id])) as any;

    if (emailResult && emailResult.length > 0) {
      const { id } = emailResult[0];

      if (id !== user_id) {
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

    // Clear token
    res.clearCookie('token');

    // Generate token
    const token = jwt.sign(
      {
        id: user_id,
        email: email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      }
    );

    // Add token in httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      user_id,
      updated: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the email',
    });
  } finally {
    // Close the connection
    db.end();
  }
}
