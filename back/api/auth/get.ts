import { Request, Response } from 'express';
import express from 'express';

import { addRandom } from './functions/addRandom';
import { randomScript } from './functions/randomScript';

const router = express.Router();

router.get('/random', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addRandom(res);
});

router.get('/randomScript', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await randomScript(res);
});

export default router;
