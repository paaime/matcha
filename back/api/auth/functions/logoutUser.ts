import { Response, Request } from 'express';
import { ThrownError } from '../../../types/type';
import { RequestUser } from '../../../types/express';

export async function logoutUser(
  req: RequestUser,
  res: Response
): Promise<undefined> {
  try {
    res.clearCookie('token');
    // TODO : set the user to null or undefined
    req.user = {
      id: -1,
      email: '',
    };
    res.sendStatus(200);
  } catch (error) {
    const e = error as ThrownError;

    const code = e?.code || 'Uxnknown error';
    const message = e?.message || 'Unknown message';

    console.error({ code, message });

    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while login the user',
    });
  }
}