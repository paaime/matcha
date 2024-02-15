import { Request, Response } from 'express';
import express from 'express';
import { getUserWithId } from './functions/getUserWithId';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  // Get all users
  // ? Not implemented yet
  res.status(501).send('Not implemented yet');
});

router.get('/:id', async (req: Request, res: Response) => {
  // Get user info by id
  const userId = parseInt(req.params.id, 10);
  const user = await getUserWithId(userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({
      error: 'Not found',
      message: `No user found with ID ${userId}`,
    });
  }
});

export default router;
