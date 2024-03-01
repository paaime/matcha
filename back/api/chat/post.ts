import express from 'express';
import { RequestUser } from '../../types/express';
import { Response } from 'express';
import { addInvitation } from './function/addInvitation';
import { addMessage } from './function/addMessage';
import { safeUserId } from '../../middlewares/authCheck';

const router = express.Router();

router.post('/invitation', async (req: RequestUser, res: Response) => {
  await addInvitation(req, res);
});

router.post('/:id', async (req: RequestUser, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!safeUserId(id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid report_id',
    });
    return;
  }

  await addMessage(id, req, res);
});

export default router;
