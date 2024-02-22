import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { loginUser } from './functions/loginUser';

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

export default router;
