import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { urlRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';

export async function upPictures(req: RequestUser, res: Response): Promise<undefined>{
  try {
    const user_id = getAuthId(req);

    // TODO: upload pictures to the server

    // Check user_id
    if (!user_id || user_id < 1) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid user id',
      });
      return;
    }

    // Get infos from body
    const { pictures } = req.body;

    if (!pictures || !Array.isArray(pictures)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid pictures',
      });
      return;
    }

    // Remove duplicates with Set
    const uniquePictures = Array.from(new Set(pictures));
    const picturesString = uniquePictures.join(',');

    // Check if pictures are valid
    if (uniquePictures.length < 1 || uniquePictures.length > 5) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid pictures',
      });
      return;
    }

    for (const picture of uniquePictures) {
      if (!urlRegex.test(picture)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid pictures',
        });
        return;
      }
    }

    const db = await connectToDatabase();

    // Update the user's pictures
    const updateQuery = 'UPDATE User SET pictures = ? WHERE id = ?';
    await db.query(updateQuery, [picturesString, user_id]);

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
      message: 'An error occurred while updating the pictures'
    });
  }
}
