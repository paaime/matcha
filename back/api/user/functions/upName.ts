import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { nameRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upName(req: RequestUser, res: Response): Promise<undefined>{
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
    const { first, last } = req.body;

    if (!nameRegex.test(first) || !nameRegex.test(last)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid name',
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

    // Update the user's name
    const updateQuery = 'UPDATE User SET lastName = ?, firstName = ? WHERE id = ?';
    await db.query(updateQuery, [last, first, user_id]);

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      updated: true
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || "Unknown error";
    const message = e?.message || "Unknown message";

    // console.error({ code, message });
    
    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while updating the name'
    });
  }
}
