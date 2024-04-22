import express from 'express';
import { RequestUser } from '../../types/express';
import { Request, Response } from 'express';
import { addInvitation } from './function/addInvitation';
import { addMessage } from './function/addMessage';
import { safeUserId } from '../../middlewares/authCheck';
import { upload } from '../../middlewares/multer';
import { uploadImage } from '../../utils/image';
import fs from 'fs';

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

  // Check if folder /back/puclic/uploads exists
  const path = process.cwd() + '/public/uploads';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  upload(req as Request, res, async (err) => {
    // Error handling for multer
    if (err) {
      res.status(500).json({
        error: 'Internal server error',
        message: err?.message || 'An error occurred while uploading the image',
      });
      return;
    }
    if (!req.file) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while uploading the image',
      });
      return;
    }

    const imageUrl = await uploadImage(req.file.buffer);

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
