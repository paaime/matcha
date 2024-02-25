import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { genderEnum } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upGender(req: RequestUser, res: Response): Promise<undefined>{
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
    const { gender } = req.body;

    if (!gender || genderEnum.indexOf(gender) === -1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid gender',
      });
      return;
    }

    const db = await connectToDatabase();

    // Update the user's gender
    const updateQuery = 'UPDATE User SET gender = ? WHERE id = ?';
    await db.query(updateQuery, [gender, user_id]);

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
    
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while updating the gender'
    });
  }
}
