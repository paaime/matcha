import express, { Request, Response } from 'express';
import { sendNotification } from './functions/initializeIo';

const router = express.Router();

router.post('/send/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { notification } = req.body;

  // Envoyer la notification à l'utilisateur
  const sent = await sendNotification(userId, req.body);

  res.status(200).json({ message: 'Notification envoyée avec succèfres', userId, sent: sent });
});

export default router;
