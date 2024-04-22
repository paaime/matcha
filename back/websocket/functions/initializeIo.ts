import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { JwtDatas, Notification } from '../../types/type';
import { addNotification } from './addNotification';
import { setOnline } from '../../utils/setOnline';
import { IMessage } from '../../types/chat';

let io: SocketIOServer;

export function initializeIO(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.DOMAIN,
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
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

    await setOnline(decoded.id, true);


    socket.on('disconnect', async () => {
      await setOnline(decoded.id, false);

      socket.leave(decoded.id.toString());
    });

    socket.on('message', (data) => {
      socket.emit('message', 'Hello from server');
    });
  });
}

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
