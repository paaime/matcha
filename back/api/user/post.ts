import { Request, Response } from 'express';
import express from 'express';
import { addUser } from './functions/addUser';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const user = await addUser(req.body);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(501).json({
      error: 'Internal server error',
      message: 'An error occurred while adding the user',
    });
  }
});

export default router;
