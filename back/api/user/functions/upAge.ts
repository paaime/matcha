import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { ageRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upAge(req: RequestUser, res: Response): Promise<undefined>{
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
    const { age } = req.body;

    if (!ageRegex.test(age)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid age',
      });
      return;
    }

    const db = await connectToDatabase();

    // Update the user's age
    const updateQuery = 'UPDATE User SET age = ? WHERE id = ?';
    await db.query(updateQuery, [age, user_id]);

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

    console.error({ code, message });
    
    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while updating the age'
    });
  }
}
