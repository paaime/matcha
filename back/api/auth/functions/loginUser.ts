import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { connectToDatabase } from '../../../utils/db';
import { checkIfFieldExist } from './addUser';
import { usernameRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';
import { logger } from '../../../utils/logger';

export async function loginUser(body: any, res: Response): Promise<undefined> {
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
    const { username, password } = body;

    // Check if fields exist
    if (checkIfFieldExist('username', username, res)) return;
    if (checkIfFieldExist('password', password, res)) return;

    const datas = {
      username: username?.trim(),
      password: password
        ?.trim()
        ?.slice(0, 35)
        // Replace dangerous characters
        ?.replace(/&/g, '')
        ?.replace(/"/g, '')
        ?.replace(/'/g, '')
        ?.replace(/</g, '')
        ?.replace(/>/g, ''),
    };

    // Check if fields exist
    if (checkIfFieldExist('username', datas.username, res)) return;
    if (checkIfFieldExist('password', datas.password, res)) return;

    // Test values with regex
    if (!usernameRegex.test(datas.username)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Username is not valid',
      });
      return;
    }


    const query = 'SELECT id, firstName, lastName, email, passwordHashed, isVerified, isGoogle FROM User WHERE username = ?';

    // Execute the query and check the result
    const [rows] = (await db.execute(query, [datas.username])) as any;

    if (rows.length === 0) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
      return;
    }

    const user = rows[0];

    if (user.isGoogle === 1) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'User is a google user',
      });
      return;
    }

    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(
      datas.password,
      user.passwordHashed
    );

    if (!passwordCorrect) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
      return;
    }

    // Check if the user is verified
    if (user.isVerified === 0) {
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const tokenHashed = bcrypt.hashSync(token, 10);

      // Update the token in the database
      const query = 'UPDATE User SET emailToken = ? WHERE username = ?';

      // Execute the query and check the result
      await db.execute(query, [tokenHashed, user.username]);

      const confirmLink =
        process.env.NEXT_PUBLIC_API +
        '/auth/confirm/' +
        user.email +
        '/' +
        token;
      const emailData = getEmailData('verifyEmail');

      if (!emailData) {
        throw new Error('Email template not found');
      }

      const mailData = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
          .replace('[FIRST_NAME]', user.firstName)
          .replaceAll('[CONFIRM_LINK]', confirmLink),
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err) {
          throw new Error('Email not sent');
        }
      });

      res.status(403).json({
        error: 'Forbidden',
        message:
          'User is not verified, a new email has been sent to verify the account.',
      });

      return;
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
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

    // Send the token
    res.status(200).json({
      token: token,
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while login the user',
    });
  } finally {
    // Close the connection
    db.end();
  }
}
