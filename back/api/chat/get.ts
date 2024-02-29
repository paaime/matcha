import express from 'express';
import { RequestUser } from '../../types/express';
import { Response } from 'express';
import { addInvitation } from './function/addInvitation';
import { getChats } from './function/getChats';

const router = express.Router();

router.get('/', async (req: RequestUser, res: Response) => {
  await getChats(req, res);
});

export default router;
