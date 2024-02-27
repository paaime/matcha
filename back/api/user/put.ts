import { Response } from 'express';
import express from 'express';

import { RequestUser } from '../../types/express';
import { upInterests } from './functions/upInterests';
import { upPictures } from './functions/upPictures';
import { upGender } from './functions/upGender';
import { upPreference } from './functions/upPreference';
import { upName } from './functions/upName';
import { upAge } from './functions/upAge';
import { upEmail } from './functions/upEmail';
import { upPassword } from './functions/upPassword';
import { upBio } from './functions/upBio';
import { upload } from '../../middlewares/multer';
import { ThrownError } from '../../types/type';
import multer from 'multer';
import { upImage } from './functions/upImage';
import { safeUserId } from '../../middlewares/authCheck';

const router = express.Router();

router.put('/pictures', async (req: RequestUser, res: Response) => {
  await upPictures(req, res);
});

router.put('/interests', async (req: RequestUser, res: Response) => {
  await upInterests(req, res);
});

router.put('/gender', async (req: RequestUser, res: Response) => {
  await upGender(req, res);
});

router.put('/preference', async (req: RequestUser, res: Response) => {
  await upPreference(req, res);
});

router.put('/name', async (req: RequestUser, res: Response) => {
  await upName(req, res);
});

router.put('/age', async (req: RequestUser, res: Response) => {
  await upAge(req, res);
});

router.put('/bio', async (req: RequestUser, res: Response) => {
  await upBio(req, res);
});

router.put('/image/:image_id', async (req: RequestUser, res: Response) => {
  const image_id = parseInt(req.params.image_id, 10);

  if (!safeUserId(image_id) || image_id > 5) {
    res.status(400).json({
      error: 'Bad request',
      message: 'Invalid image_id',
    });
    return;
  }
  await upImage(req, res, image_id);
});

router.put('/email', async (req: RequestUser, res: Response) => {
  await upEmail(req, res);
});

router.put('/password', async (req: RequestUser, res: Response) => {
  await upPassword(req, res);
});

export default router;
