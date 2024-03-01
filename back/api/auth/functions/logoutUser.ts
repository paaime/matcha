import { Response, Request } from 'express';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';

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

    const code = e?.code || 'Uxnknown error';
    const message = e?.message || 'Unknown message';

    // console.error({ code, message });

    res.status(401).json({ // 501 for real but not tolerated by 42
      error: 'Server error',
      message: 'An error occurred while login the user',
    });
  }
}
