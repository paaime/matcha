import { Response } from 'express';
import express from 'express';

import { getUserWithId } from './functions/getUserWithId';
import { getUserConnected } from './functions/getUserConnected';
import { getDiscovery } from './functions/getDiscovery';
import { getLove } from './functions/getLove';
import { RequestUser } from '../../types/express';
import { getAuthId } from '../../middlewares/authCheck';
import { getLikes } from './functions/getLikes';
import { getLikesSent } from './functions/getLikesSent';
import { getFiltersInfos } from './functions/getFiltersInfos';
import { getMapUsers } from './functions/getMap';
import { usernameRegex } from '../../types/regex';

const router = express.Router();

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
  await getLove(req, res, true);
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

router.get('/filtersInfos', async (req: RequestUser, res: Response) => {
  await getFiltersInfos(req, res);
});

router.get('/:id', async (req: RequestUser, res: Response) => {
  // Get user info by id
  const username = req.params?.id;

  if (!username) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Missing username',
    });
    return;
  }

  if (!usernameRegex.test(username)) {
    res.status(422).json({
      error: 'Unprocessable entity',
      message: 'Invalid username',
    });
    return;
  }

  await getUserWithId(username, getAuthId(req), res);
});

export default router;
