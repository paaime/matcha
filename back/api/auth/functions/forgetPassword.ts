import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { emailRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';

export async function forgetPassword(
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
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Property email is missing',
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

    // Check if the user is Google and get user's infos
    const usrQuery = 'SELECT id, firstName, isGoogle FROM User WHERE email = ? LIMIT 1';
    const [usrResult] = (await db.query(usrQuery, [email])) as any;

    // Check if user exists
    if (!usrResult || usrResult.length === 0) {
      res.status(404).json({
        error: 'Email not found',
        message: 'Email not found',
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

    const user_id = usrResult[0].id;
    const firstName = usrResult[0].firstName;

    // Generate token to verify email
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const tokenHashed = bcrypt.hashSync(token, 10);

    // Update the user's email
    const updateQuery = 'UPDATE User SET emailToken = ? WHERE id = ?';
    (await db.query(updateQuery, [tokenHashed, user_id])) as any;

    // Send email
    const emailData = getEmailData('resetPassword');

    if (!emailData) {
      throw new Error('Email template not found');
    }

    const mailData = {
      from: process.env.MAIL_USER,
      to: email,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
        .replace('[FIRST_NAME]', firstName)
        .replaceAll(
          '[RESET_LINK]',
          `${process.env.DOMAIN}/auth/reset-password/?token=${token}&email=${email}`
        ),
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        throw new Error('Email not sent');
      }
    });

    res.status(200).json({
      user_id,
      sent: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while sending the email',
    });
  } finally {
    // Close the connection
    db.end();
  }
}
