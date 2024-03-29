import express from 'express';
import { RequestUser } from '../../types/express';
import { Request, Response } from 'express';
import { addInvitation } from './function/addInvitation';
import { addMessage } from './function/addMessage';
import { safeUserId } from '../../middlewares/authCheck';
import { upload } from '../../middlewares/multer';

const router = express.Router();

router.post('/invitation', async (req: RequestUser, res: Response) => {
  await addInvitation(req, res);
});

router.post('/:id/image', async (req: RequestUser, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!safeUserId(id)) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid report_id',
    });
    return;
  }
  upload(req as Request, res, async (err) => {
    // Error handling for multer
    if (err) {
      res.status(400).json({
        error: 'Bad request',
        message: err?.message || 'An error occurred while uploading the image',
      });
      return;
    }
    if (!req.file) {
      res.status(400).json({
        error: 'Bad request',
        message: 'An error occurred while uploading the image',
      });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await addMessage(id, imageUrl, req, res);
  });
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

  await addMessage(id, null, req, res);
});

export default router;
