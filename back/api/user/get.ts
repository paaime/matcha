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
import { getFiltersInfos } from './functions/getFiltersInfos';
import { getMapUsers } from './functions/getMap';

const router = express.Router();

router.get('/', async (req: RequestUser, res: Response) => {
  await getAllUsers(res);
});

router.get('/map', async (req: RequestUser, res: Response) => {
  await getMapUsers(req, res);
});

router.get('/discovery/news', async (req: RequestUser, res: Response) => {
  await getDiscovery(req, res);
});

router.get('/discovery/results', async (req: RequestUser, res: Response) => {
  await getLove(req, res, true);
});

router.get('/getlove', async (req: RequestUser, res: Response) => {
  await getLove(req, res);
});

router.get('/me', async (req: RequestUser, res: Response) => {
  console.log(req.headers.location);
  console.log(req.ips, req.ip);
  console.log(req.headers['x-forwarded-for']);
  console.log(req.headers['x-real-ip']);
  console.log(req.headers['x-forwarded-host']);
  console.log(req.headers['x-forwarded-proto']);
  console.log(req.headers['x-forwarded-port']);
  await getUserConnected(req, res);
});

router.get('/getLikes', async (req: RequestUser, res: Response) => {
  await getLikes(req, res);
});

router.get('/getLikesSent', async (req: RequestUser, res: Response) => {
  await getLikesSent(req, res);
});

router.get('/filtersInfos', async (req: RequestUser, res: Response) => {
  await getFiltersInfos(req, res);
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
