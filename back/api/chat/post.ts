import express from 'express';
import { RequestUser } from '../../types/express';
import { Response } from 'express';
import { addInvitation } from './function/addInvitation';

const router = express.Router();

router.post('/invitation', async (req: RequestUser, res: Response) => {
  await addInvitation(req, res);
});

export default router;
