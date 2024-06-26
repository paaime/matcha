import { Response } from 'express';
import bcrypt from 'bcrypt';

import { connectToDatabase } from '../../../utils/db';
import { passwordRegex } from '../../../types/regex';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { getAuthId } from '../../../middlewares/authCheck';
import { logger } from '../../../utils/logger';

export async function upPassword(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  const db = await connectToDatabase();

  if (!db) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Database connection error',
    });
    return;
  }

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
    const { current, newPass } = req.body;

    if (!current || !newPass) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Missing password',
      });
      return;
    }

    if (!passwordRegex.test(newPass)) {
      res.status(422).json({
        error: 'Unprocessable entity',
        message: 'Invalid new password',
      });
      return;
    }

    // Check if the user is Google
    const usrQuery = 'SELECT passwordHashed, isGoogle FROM User WHERE id = ?';
    const [usrResult] = (await db.query(usrQuery, [user_id])) as any;

    // Check if user exists
    if (!usrResult || usrResult.length === 0) {
      res.status(404).json({
        error: 'User not found',
        message: 'User not found',
      });
      return;
    }

    // Check if the user is Google
    if (usrResult && usrResult.length > 0 && usrResult[0].isGoogle) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Google user cannot update password',
      });
      return;
    }

    const user = usrResult[0];

    if (!bcrypt.compareSync(current, user.passwordHashed)) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Invalid password',
      });
      return;
    }

    // Update the user's password
    const passHash = await bcrypt.hash(newPass, 10);

    const updateQuery = 'UPDATE User SET passwordHashed = ? WHERE id = ?';
    await db.query(updateQuery, [passHash, user_id]);

    res.status(200).json({
      user_id,
      updated: true,
    });
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating the password',
    });
  } finally {
    // Close the connection
    db.end();
  }
}
