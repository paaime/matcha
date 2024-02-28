import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { loginUser } from './functions/loginUser';
import { logoutUser } from './functions/logoutUser';
import { completeUser } from './functions/completeUser';
import { authCheck } from '../../middlewares/authCheck';
import { forgetPassword } from './functions/forgetPassword';
import { resetPassword } from './functions/resetPassword';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addUser(req.body, res);
});

router.post('/complete', authCheck, async (req: Request, res: Response) => {
  await completeUser(req.body, req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await loginUser(req.body, res);
});

router.post('/logout', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await logoutUser(req, res);
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await forgetPassword(req, res);
});

router.post('/reset-password', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await resetPassword(req, res);
});

export default router;
