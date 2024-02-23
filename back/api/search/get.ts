import { Request, Response } from 'express';
import express from 'express';
import { searchUsers } from './functions/searchUsers';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  await searchUsers(res);
});

export default router;
