import { Response, Request } from 'express';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';
import { logger } from '../../../utils/logger';

export async function logoutUser(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    res.clearCookie('token');

    req.user = undefined;

    res.sendStatus(200);
  } catch (error) {
    const e = error as ThrownError;

    logger(e);

    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while login the user',
    });
  }
}
