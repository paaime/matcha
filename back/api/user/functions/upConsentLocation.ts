import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { logger } from '../../../utils/logger';

export async function upConsentLocation(
  req: RequestUser,
  res: Response
): Promise<undefined> {
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
    const { consent } = req.body;

    if (consent === undefined) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Missing consent',
      });
      return;
    }

    if (typeof consent !== 'boolean') {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid consent value',
      });
      return;
    }

    const db = await connectToDatabase();

    if (!db) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Database connection error',
      });
      return;
    }

    // Update the user's biography
    const updateQuery = 'UPDATE User SET consentLocation = ? WHERE id = ?';
    await db.query(updateQuery, [consent, user_id]);

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      updated: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the consent location',
    });
  }
}
