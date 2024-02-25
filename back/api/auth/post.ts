import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { loginUser } from './functions/loginUser';
import { logoutUser } from './functions/logoutUser';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addUser(req.body, res);
});

router.post('/login', async (req: Request, res: Response) => {
  // Clear cookie
  console.log('clear cookie');
  res.clearCookie('token');

  await loginUser(req.body, res);
});

router.post('/logout', async (req: Request, res: Response) => {
  // Clear cookie
  await logoutUser(req, res);
});

export default router;
