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
  try {
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
    const emailQuery = 'SELECT id, firstName FROM User WHERE email = ?';
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
    const firstName = emailResult[0].firstName;

    // Generate token to verify email
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const tokenHashed = bcrypt.hashSync(token, 10);

    // Update the user's email
    const updateQuery = 'UPDATE User SET emailToken = ? WHERE id = ?';
    (await db.query(updateQuery, [tokenHashed, user_id])) as any;

    // Close the connection
    db.end();

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

    console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while sending the email',
    });
  }
}
