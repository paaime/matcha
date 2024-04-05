import { Response } from 'express';
import { Notification, ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { updateFame } from '../../../utils/fame';
import { getEmailData } from '../../../utils/emails';
import { transporter } from '../../..';

export async function reportUser(report_id: number, req: RequestUser, res: Response): Promise<void> {
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

    if (!report_id || report_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid report_id',
      });
      return;
    }

    if (report_id === user_id) {
      res.status(400).json({
        error: 'Bad request',
        message: 'You cannot report yourself',
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

    // Check if the user exists
    const [rows] = (await db.query('SELECT firstName, email FROM User WHERE id = ?', [report_id])) as any;

    if (!rows || rows.length === 0) {
      // Close the connection
      await db.end();

      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    const firstName = rows[0].firstName;
    const email = rows[0].email;

    // Add report
    const query = 'INSERT INTO Reported (user_id, reported_user_id) VALUES (?, ?)';
    await db.query(query, [user_id, report_id]) as any;

    // Close the connection
    await db.end();

    // Send notifications
    await sendNotification(report_id.toString(), {
      content: 'Someone reported you',
      related_user_id: user_id,
    } as Notification);
    await sendNotification(user_id.toString(), {
      content: `You have reported ${firstName}`,
      redirect: `/profile/${report_id}`,
      related_user_id: report_id,
    } as Notification);

    // Update fame
    await updateFame(report_id, 'newReport');

    // Send email
    const emailData = getEmailData('reportUser');

    if (!emailData) {
      throw new Error('Email template not found');
    }

    const mailData = {
      from: process.env.MAIL_USER,
      to: email,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html.replace('[FIRST_NAME]', firstName)
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        throw new Error('Email not sent');
      }
    });

    res.status(200).json({
      reported: true
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    // Check if duplicate entry
    if (code === 'ER_DUP_ENTRY') {
      res.status(400).json({
        error: 'Bad request',
        message: 'You have already reported this user',
      });
      return;
    }

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'Error reporting user',
    });
  }
}
