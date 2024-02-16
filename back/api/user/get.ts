import { Request, Response } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';

import { getUserWithId } from './functions/getUserWithId';
import { JwtDatas } from '../../types/type';
import { getUserConnected } from './functions/getUserConnected';
import { getAllUsers } from './functions/getAllUsers';
import { addRandom } from './functions/addRandom';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  await getAllUsers(res);
});

router.get('/random', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');
  
  await addRandom(res);
});

router.get('/:id', async (req: Request, res: Response) => {
  // Get token from cookie
  const token = req.cookies?.token;

  if (!token || token === 'Bearer undefined') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Token is missing'
    });
    return;
  }

  // Decryption of token
  const tokenContent = token.trim();

  // Get token JWT infos
  const decoded = jwt.decode(tokenContent) as JwtDatas;

  if (!decoded || !decoded.id || !Number.isInteger(decoded.id) || decoded.id < 1) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
    return;
  }

  // Get user info by id
  const userId = parseInt((req.params?.id || "0"), 10);

  if (!userId || userId < 1) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid user id'
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
