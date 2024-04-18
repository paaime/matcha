import { getAuthId } from '../../../middlewares/authCheck';
import { RequestUser } from '../../../types/express';
import { Response } from 'express';
import { connectToDatabase } from '../../../utils/db';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';

export async function addInvitation(
  req: RequestUser,
  res: Response
): Promise<void> {
  try {
    const { match_id, activity } = req.body;

    const user_id = getAuthId(req);

    // Check activty
    if (
      !activity ||
      activity === '' ||
      !['Dinner', 'Movie', 'Park'].includes(activity)
    ) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid activity',
      });
      return;
    }

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    // Check the match_id
    if (!match_id || match_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid match id',
      });
      return;
    }

    const db = await connectToDatabase();

    if (!db) {
      res.status(400).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    const query = `
      SELECT
        m.id AS match_id,
        u1.firstName AS user_firstName,
        u1.id AS user_id,
        u1.email AS user_email,
        u2.firstName AS other_user_firstName,
        u2.id AS other_user_id,
        u2.email AS other_user_email
      FROM
        Matchs m
        JOIN User u1 ON m.user_id = u1.id
        JOIN User u2 ON m.other_user_id = u2.id
      WHERE
        m.id = ? AND (m.user_id = ? OR m.other_user_id = ?);
    `;

    // Execute the query with correct placeholders
    const [rows] = (await db.query(query, [match_id, user_id, user_id])) as any;

    // Close the connection
    await db.end();

    if (!rows || rows.length === 0) {
      // console.error('No match found');

      res.status(404).json({
        error: 'Not found',
        message: 'No match found',
      });
      return;
    }

    const match = rows[0];

    // Send email to each user
    const emailData = getEmailData('inviteToDate');

    if (!emailData) {
      throw new Error('Email template not found');
    }

    const firstName =
      user_id === match.user_id
        ? match.other_user_firstName
        : match.user_firstName;
    const invitatorFirstName =
      user_id === match.user_id
      ? match.user_firstName
      : match.other_user_firstName;
    const email =
      user_id === match.user_id ? match.other_user_email : match.user_email;

    const mailData = {
      from: process.env.MAIL_USER,
      to: email,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html
        .replace('[ACTIVITY]', activity)
        .replace('[FIRST_NAME]', firstName)
        .replace('[INVITATOR_FIRST_NAME]', invitatorFirstName),
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        throw new Error('Email not sent');
      }
    });

    res.status(201).json({
      message: 'Invitation added',
    });
    return;
  } catch (err) {
    // console.error(err);
    res.status(400).json({ // 500 for real but not tolerated by 42
      error: 'Internal server error',
      message: 'An error occured while adding the invitation',
    });
  }
}
