import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { checkIfFieldExist } from './addUser';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';

export async function confirmEmail(params: any, res: Response): Promise<undefined> {
  try {
    // Get infos from body
    const { email, token } = params;

    // Check if fields exist
    if (checkIfFieldExist('email', email, res)) return;
    if (checkIfFieldExist('token', token, res)) return;

    const safeEmail = email.trim().toLowerCase();
    const safeToken = token.trim();

    // Check if email is valid
    if (!emailRegex.test(safeEmail)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Email is not valid',
      });
      return;
    }

    // Check if token is valid
    if (!/[a-z0-9]/.test(safeToken)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Token is not valid',
      });
      return;
    }

    const db = await connectToDatabase();

    const query = 'SELECT id, emailToken, isVerified FROM User WHERE email = ?';

    // Execute the query and check the result
    const [rows] = (await db.execute(query, [safeEmail])) as any;

    if (rows.length === 0) {
      // Close the connection
      db.end();

      res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    const user = rows[0];

    if (user.isVerified === 1) {
      // Close the connection
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'User is already verified',
      });
      return;
    }

    // Check if token is valid
    if (!bcrypt.compareSync(safeToken, user.emailToken)) {
      // Close the connection
      db.end();

      res.status(400).json({
        error: 'Bad request',
        message: 'Token is not valid',
      });
      return;
    }

    // Update the user to set isVerified to 1
    const queryUpdate = 'UPDATE User SET emailToken = ?, isVerified = ? WHERE id = ?';
    await db.execute(queryUpdate, [null, 1, user.id]);

    // Close the connection
    db.end();

    res.status(200).json({
      message: 'Email confirmed',
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while confirming the email. Please try again later.',
    });
  }
}
