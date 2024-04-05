import { Request, Response } from 'express';
import express from 'express';

import { confirmEmail } from './functions/confirmEmail';
import { googleAuth } from './functions/googleAuth';

const router = express.Router();

router.get('/confirm/:email/:token', async (req: Request, res: Response) => {
  await confirmEmail(req.params, res);
});

router.get('/google-auth', async (req: Request, res: Response) => {
  await googleAuth(req, res);
});

export default router;
