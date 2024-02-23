import { Request, Response } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';

import { getUserWithId } from './functions/getUserWithId';
import { JwtDatas } from '../../types/type';
import { getUserConnected } from './functions/getUserConnected';
import { getAllUsers } from './functions/getAllUsers';
import { getDiscovery } from './functions/getDiscovery';
import { getLove } from './functions/getLove';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  await getAllUsers(res);
});

router.get('/discovery', async (req: Request, res: Response) => {
  await getDiscovery(req, res);
});

router.get('/getlove', async (req: Request, res: Response) => {
  await getLove(req, res);
});

router.get('/me', async (req: Request, res: Response) => {
  // Get token from cookie
  const token = req.cookies?.token;

  if (!token || token === 'Bearer undefined') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token is missing',
    });
    return;
  }

  // Decryption of token
  const tokenContent = token.trim();

  // Get token JWT infos
  const decoded = jwt.decode(tokenContent) as JwtDatas;

  if (
    !decoded ||
    !decoded.id ||
    !Number.isInteger(decoded.id) ||
    decoded.id < 1
  ) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
    return;
  }

  await getUserConnected(decoded.id, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  // Get token from cookie
  const token = req.cookies?.token;

  if (!token || token === 'Bearer undefined') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token is missing',
    });
    return;
  }

  // Decryption of token
  const tokenContent = token.trim();

  // Get token JWT infos
  const decoded = jwt.decode(tokenContent) as JwtDatas;

  if (
    !decoded ||
    !decoded.id ||
    !Number.isInteger(decoded.id) ||
    decoded.id < 1
  ) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
    return;
  }

  // Get user info by id
  const userId = parseInt(req.params?.id || '0', 10);

  if (!userId || userId < 1) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid user id',
    });
    return;
  }

  if (userId === decoded.id) {
    await getUserConnected(decoded.id, res);
    return;
  }

  await getUserWithId(userId, decoded.id, res);
});

export default router;
