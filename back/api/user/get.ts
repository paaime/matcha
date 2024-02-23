import { Response } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';

import { getUserWithId } from './functions/getUserWithId';
import { JwtDatas } from '../../types/type';
import { getUserConnected } from './functions/getUserConnected';
import { getAllUsers } from './functions/getAllUsers';
import { getDiscovery } from './functions/getDiscovery';
import { getLove } from './functions/getLove';
import { RequestUser } from '../../types/express';
import { getAuthId } from '../../middlewares/authCheck';

const router = express.Router();

router.get('/', async (req: RequestUser, res: Response) => {
  await getAllUsers(res);
});

router.get('/discovery', async (req: RequestUser, res: Response) => {
  await getDiscovery(req, res);
});

router.get('/getlove', async (req: RequestUser, res: Response) => {
  await getLove(req, res);
});

router.get('/me', async (req: RequestUser, res: Response) => {
  await getUserConnected(req, res);
});

router.get('/:id', async (req: RequestUser, res: Response) => {
  // Get user info by id
  const userId = (req.params?.id as unknown as number) || -1;

  if (!userId || userId < 1) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid user id',
    });
    return;
  }

  await getUserWithId(userId, getAuthId(req), res);
});

export default router;
