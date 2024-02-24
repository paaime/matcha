import { Request, Response } from 'express';
import express from 'express';

import { addUser } from './functions/addUser';
import { addInterest } from './functions/addInterest';
import { getAuthId, safeUserId } from '../../middlewares/authCheck';
import { RequestUser } from '../../types/express';
import { addLike } from './functions/addLike';
import { removeLike } from './functions/removeLike';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addUser(req.body, res);
});

router.post('/interest', async (req: RequestUser, res: Response) => {
  await addInterest(req.body, req, res);
});

router.post('/like/:liked_id', async (req: RequestUser, res: Response) => {
  const liked_id = parseInt(req.params.liked_id, 10);

  if (!safeUserId(liked_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid liked_id',
    });
    return;
  }

  await addLike(liked_id, req, res);
});

router.post('/unlike/:liked_id', async (req: RequestUser, res: Response) => {
  const liked_id = parseInt(req.params.liked_id, 10);

  if (!safeUserId(liked_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid liked_id',
    });
    return;
  }

  await removeLike(liked_id, req, res);
});

export default router;
