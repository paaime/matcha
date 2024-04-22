import fs from 'fs';
import { Request } from 'express';
import { Response } from 'express';

import { upload } from '../../../middlewares/multer';
import { getAuthId } from '../../../middlewares/authCheck';
import { RequestUser } from '../../../types/express';
import { connectToDatabase } from '../../../utils/db';
import { uploadImage } from '../../../utils/image';
import { ThrownError } from '../../../types/type';
import { logger } from '../../../utils/logger';

export async function upImage(
  req: RequestUser,
  res: Response,
  image_id: number
): Promise<undefined> {

  // Check if folder exists
  const folder = process.cwd() + '/public/uploads';
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  upload(req as Request, res, async (err) => {
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

      // Error handling for multer
      if (err) {
        res.status(500).json({
          error: 'Bad request',
          message:
            err?.message || 'An error occurred while uploading the image',
        });
        return;
      }
      if (!req.file) {
        res.status(500).json({
          error: 'Bad request',
          message: 'An error occurred while uploading the image',
        });
        return;
      }

      // Update the user's image
      const imageUrl = await uploadImage(req.file.buffer);

      const db = await connectToDatabase();

      if (!db) {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Database connection error',
        });
        return;
      }

      // Get the user's pictures
      const getQuery = 'SELECT pictures FROM User WHERE id = ?';
      const [row] = (await db.query(getQuery, [user_id])) as any;

      if (!row || !row[0]) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid user id',
        });
        return;
      }

      const pictures = row[0].pictures;
      let picturesArray;

      if (!pictures) {
        picturesArray = [];
      } else {
        picturesArray = pictures.split(',');
      }

      if (picturesArray.length + 1 < image_id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Please upload the images in order',
        });
        return;
      }

      picturesArray[image_id - 1] = imageUrl;
      const newPictures = picturesArray.join(',');

      // Update the user's pictures
      const updateQuery = 'UPDATE User SET pictures = ? WHERE id = ?';
      await db.query(updateQuery, [newPictures, user_id]);

      // Close the connection
      db.end();
      res.json({ success: true, newPictures });
    } catch (error) {
      const e = error as ThrownError;

      logger(e);

      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while updating the pictures',
      });
    }
  });
}
