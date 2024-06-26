import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { interestsList } from '../../../types/list';
import { logger } from '../../../utils/logger';

export async function upInterests(req: RequestUser, res: Response): Promise<undefined>{
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
    const { interests } = req.body;

    if (!interests) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Missing interests',
      });
      return;
    }

    if (!Array.isArray(interests)) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid interests',
      });
      return;
    }

    // Remove duplicates with Set
    const uniqueInterests = Array.from(new Set(interests));

    // Check if interests are valid
    for (const interest of uniqueInterests) {
      if (!interestsList.includes(interest)) {
        // Remove from the list
        uniqueInterests.splice(uniqueInterests.indexOf(interest), 1);
      }
    }

    const db = await connectToDatabase();

    if (!db) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    // Reset the user's interests
    const resetQuery = 'DELETE FROM Tags WHERE user_id = ?';
    await db.query(resetQuery, [user_id]);

    // Add the new interests
    const insertQuery = 'INSERT INTO Tags (user_id, tagName) VALUES ?';
    const values = uniqueInterests.map((tag: string) => [user_id, tag]);
    await db.query(insertQuery, [values]);

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      updated: true
    });
  } catch (error) {
    const e = error as ThrownError;

    logger(e);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the interests'
    });
  }
}
