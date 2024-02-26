import { Response } from 'express';
import express from 'express';

import { safeUserId } from '../../middlewares/authCheck';
import { RequestUser } from '../../types/express';
import { addLike } from './functions/addLike';
import { removeLike } from './functions/removeLike';
import { reportUser } from './functions/reportUser';
import { blockUser } from './functions/blockUser';
import { unblockUser } from './functions/unblockUser';

const router = express.Router();

router.post('/like/:liked_id', async (req: RequestUser, res: Response) => {
  const liked_id = parseInt(req.params.liked_id, 10);

  if (!safeUserId(liked_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid liked_id',
    });
    return;
  }

  await addLike(liked_id, req, res);
});

router.post('/unlike/:liked_id', async (req: RequestUser, res: Response) => {
  const liked_id = parseInt(req.params.liked_id, 10);

  if (!safeUserId(liked_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid liked_id',
    });
    return;
  }

  await removeLike(liked_id, req, res);
});

router.post('/report/:report_id', async (req: RequestUser, res: Response) => {
  const report_id = parseInt(req.params.report_id, 10);

  if (!safeUserId(report_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid report_id',
    });
    return;
  }

  await reportUser(report_id, req, res);
});

router.post('/block/:block_id', async (req: RequestUser, res: Response) => {
  const block_id = parseInt(req.params.block_id, 10);

  if (!safeUserId(block_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid report_id',
    });
    return;
  }

  await blockUser(block_id, req, res);
});

router.post('/unblock/:unblock_id', async (req: RequestUser, res: Response) => {
  const unblock_id = parseInt(req.params.unblock_id, 10);

  if (!safeUserId(unblock_id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid report_id',
    });
    return;
  }

  await unblockUser(unblock_id, req, res);
});

export default router;
