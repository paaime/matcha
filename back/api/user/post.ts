import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { addInterest } from './functions/addInterest';
import { loginUser } from './functions/loginUser';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  await addUser(req.body, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req.body, res);
});

router.post('/interest', async (req: Request, res: Response) => {
  // Get token from header
  const token = req.headers.authorization;

  if (!token || token === 'Bearer undefined') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token is missing'
    });
    return;
  }

  await addInterest(req.body, token, res);
});

export default router;
