import { Request, Response } from 'express';
import express from 'express';

import { addRandom } from './functions/addRandom';
import { randomScript } from './functions/randomScript';
import { transporter } from '../..';

const router = express.Router();

router.get('/random', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await addRandom(res);
});

router.get('/randomScript', async (req: Request, res: Response) => {
  // Clear cookie
  res.clearCookie('token');

  await randomScript(res);
});

router.get('/mail', async (req: Request, res: Response) => {

  const mailData = {
    from: process.env.MAIL_USER,
    to: 'damien.vergobbi.pro@gmail.com',
    subject: 'Sending Email using Matcha',
    text: 'That was easy!',
    html: `<b>Hey there! </b>
            <br> This is our first message sent with Nodemailer<br/>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error while sending email',
      });
    } else {
      console.log(info);
      res.status(200).json({
        message: 'Email sent',
      });
    }
  });
});

export default router;
