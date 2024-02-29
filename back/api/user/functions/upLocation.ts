import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { biographyRegex, locationRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upLocation(
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
    const { location } = req.body;

    if (!locationRegex.test(location)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid location',
      });
      return;
    }

    const db = await connectToDatabase();

    // Update the user's biography
    const updateQuery = 'UPDATE User SET loc = ? WHERE id = ?';
    await db.query(updateQuery, [location, user_id]);

    // Close the connection
    db.end();

    res.status(200).json({
      user_id,
      updated: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Unknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while updating the location',
    });
  }
}
