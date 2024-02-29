import { Request, Response } from 'express';
import express from 'express';

import { confirmEmail } from './functions/confirmEmail';
import { googleAuth } from './functions/googleAuth';
import { randUser } from './functions/randUser';
import { randLikes } from './functions/randLikes';
import { randTags } from './functions/randTags';
import { randVisits } from './functions/randVisits';

const router = express.Router();

router.get('/init/users/:total', async (req: Request, res: Response) => {
  const total = parseInt(req.params.total);

  await randUser(res, total);
});

router.get('/init/likes/:total', async (req: Request, res: Response) => {
  const total = parseInt(req.params.total);

  await randLikes(res, total);
});

router.get('/init/tags/:total', async (req: Request, res: Response) => {
  const total = parseInt(req.params.total);

  await randTags(res, total);
});

router.get('/init/visits/:total', async (req: Request, res: Response) => {
  const total = parseInt(req.params.total);

  await randVisits(res, total);
});

router.get('/confirm/:email/:token', async (req: Request, res: Response) => {
  await confirmEmail(req.params, res);
});

router.get('/google-auth', async (req: Request, res: Response) => {
  await googleAuth(req, res);
});

export default router;
