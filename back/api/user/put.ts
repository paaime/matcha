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

router.put('/email', async (req: RequestUser, res: Response) => {
  await upEmail(req, res);
});

router.put('/password', async (req: RequestUser, res: Response) => {
  await upPassword(req, res);
});

export default router;
