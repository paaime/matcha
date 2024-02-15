import { Request, Response } from 'express';
import express from 'express';
import { addUser } from './functions/addUser';
import { addInterest } from './functions/addInterest';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const user = await addUser(req.body);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the user',
    });
  }
});

router.post('/interest', async (req: Request, res: Response) => {
  const user = await addInterest(req.body, res);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(501).json({
      error: 'Server error',
      message: 'An error occurred while adding the interest',
    });
  }
});

export default router;
