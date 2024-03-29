import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { JwtDatas, Notification } from '../../types/type';
import { addNotification } from './addNotification';
import { setOnline } from '../../utils/setOnline';
import { IMessage } from '../../types/chat';

// Définir une variable globale io
let io: SocketIOServer;

// Fonction pour initialiser io
export function initializeIO(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.DOMAIN,
      credentials: true,
    },
  });

  // Gérer la connexion des sockets
  io.on('connection', async (socket) => {
    // console.log('A client just arrived with id:', socket.id);

    if (!socket.request.headers.cookie) {
      return;
    }

    const cookies = cookie.parse(socket.request.headers.cookie);
    const { token } = cookies;

    if (!token || token === 'Bearer undefined') {
      return;
    }

    // Decryption of token
    const tokenContent = token.trim();

    // Get token JWT infos
    const decoded = jwt.decode(tokenContent) as JwtDatas;

    if (
      !decoded ||
      !decoded.id ||
      !Number.isInteger(decoded.id) ||
      decoded.id < 1
    ) {
      return;
    }

    socket.join(decoded.id.toString());
    // console.log('User', decoded.id, 'just joined');

    await setOnline(decoded.id, true);

    // io.emit(
    //   'notification',
    //   JSON.stringify({
    //     content: 'Hello from server',
    //     redirect: '/',
    //     related_user_id: decoded.id,
    //   })
    // );

    socket.on('disconnect', async () => {
      // console.log('A client has just left:', decoded.id);

      await setOnline(decoded.id, false);

      socket.leave(decoded.id.toString());
    });

    socket.on('message', (data) => {
      // console.log('Message from client:', data);
      socket.emit('message', 'Hello from server');
    });
  });
}

// Fonction pour envoyer une notification
export const sendNotification = async (
  userId: string,
  body: Notification
): Promise<boolean> => {
  const { content } = body;

  if (!content || content.length < 1) {
    return false;
  }

  io.to(userId).emit('notification', JSON.stringify(body));

  return await addNotification(Number(userId), body);
};

// Fonction pour envoyer un message
export const sendMessage = async (
  userId: string,
  body: IMessage
): Promise<boolean> => {
  const { content } = body;

  if (!content || content.length < 1) {
    return false;
  }

  io.to(userId).emit('message', JSON.stringify(body));

  return true;
};
