import { Response } from 'express';
import express from 'express';

import { getUserWithId } from './functions/getUserWithId';
import { getUserConnected } from './functions/getUserConnected';
import { getAllUsers } from './functions/getAllUsers';
import { getDiscovery } from './functions/getDiscovery';
import { getLove } from './functions/getLove';
import { RequestUser } from '../../types/express';
import { getAuthId } from '../../middlewares/authCheck';
import { getLikes } from './functions/getLikes';
import { getLikesSent } from './functions/getLikesSent';

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

router.get('/getLikes', async (req: RequestUser, res: Response) => {
  await getLikes(req, res);
});

router.get('/getLikesSent', async (req: RequestUser, res: Response) => {
  await getLikesSent(req, res);
});

router.get('/:id', async (req: RequestUser, res: Response) => {
  // Get user info by id
  const userId = parseInt(req.params?.id) || -1;

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
