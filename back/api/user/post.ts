import { Request, Response } from 'express';
import express from 'express';
import { addUser } from './functions/addUser';
import { addInterest } from './functions/addInterest';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  await addUser(req.body, res);
});

router.post('/interest', async (req: Request, res: Response) => {
  await addInterest(req.body, res);
});

export default router;
