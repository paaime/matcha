import express from 'express';
import { RequestUser } from '../../types/express';
import { Response } from 'express';
import { addInvitation } from './function/addInvitation';
import { getChats } from './function/getChats';
import { getChatWithId } from './function/getChatWithId';
import { safeUserId } from '../../middlewares/authCheck';

const router = express.Router();

router.get('/', async (req: RequestUser, res: Response) => {
  await getChats(req, res);
});

router.get('/:id', async (req: RequestUser, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!safeUserId(id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid chat id',
    });
    return;
  }

  await getChatWithId(id, req, res);
});

export default router;
