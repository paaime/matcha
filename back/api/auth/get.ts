import { Request, Response } from 'express';
import express from 'express';

import { addRandom } from './functions/addRandom';
import { randomScript } from './functions/randomScript';
import { confirmEmail } from './functions/confirmEmail';

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

router.get('/confirm/:email/:token', async (req: Request, res: Response) => {
  await confirmEmail(req.params, res);
});

export default router;
