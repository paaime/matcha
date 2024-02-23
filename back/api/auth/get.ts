import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { loginUser } from './functions/loginUser';
import { addRandom } from './functions/addRandom';

const router = express.Router();

router.get('/random', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addRandom(res);
});

export default router;
