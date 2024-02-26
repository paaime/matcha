import { Response } from 'express';
import { ThrownError } from '../../../types/type';
import { connectToDatabase } from '../../../utils/db';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { sendNotification } from '../../../websocket/functions/initializeIo';
import { updateFame } from '../../../utils/fame';

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

    // Check if the user exists
    const [rows] = (await db.query('SELECT firstName FROM User WHERE id = ?', [report_id])) as any;

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

    // Add report
    const query = 'INSERT INTO Reported (user_id, reported_user_id) VALUES (?, ?)';
    await db.query(query, [user_id, report_id]) as any;

    // Close the connection
    await db.end();

    // Send notifications
    await sendNotification(report_id.toString(), {
      content: 'Someone reported you'
    });
    await sendNotification(user_id.toString(), {
      content: `You have reported ${firstName}`
    });

    // Update fame
    await updateFame(report_id, 'newReport');

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

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'Error reporting user',
    });
  }
}
