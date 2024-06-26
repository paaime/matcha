import { Response } from 'express';

import { connectToDatabase } from '../../../utils/db';
import { locationRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { logger } from '../../../utils/logger';

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

    if (!location) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Missing location',
      });
      return;
    }

    if (!locationRegex.test(location)) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid location',
      });
      return;
    }

    // Get City
    const datas = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.split(',')[0]}&lon=${location.split(',')[1]}&zoom=18&addressdetails=1`
    ).then((res) => res.json()) as any;

    if (!datas || !datas.address) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid location',
      });
      return;
    }
    
    const city = datas.address.city || datas.address.town || datas.address.village || datas.address.county || datas.address.state || datas.address.country;

    // regex with numbers and ' " = @ # $ % ^ & * ( ) - _ + = { } [ ] | \ / : ; < > , . ? / ` ~
    const cityRegex = /^[^0-9@#\$%\^&*\(\)\+=\{\}\[\]\|\\\/:;<>\?\/`~]+$/;

    if (!city || city.length === 0 || !cityRegex.test(city)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid location',
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
    const updateQuery = 'UPDATE User SET loc = ?, city = ? WHERE id = ?';
    await db.query(updateQuery, [location, city, user_id]);

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
      message: 'An error occurred while updating the location',
    });
  }
}
