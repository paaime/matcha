import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { JwtDatas, Notification } from '../../types/type';
import { addNotification } from './addNotification';

// Définir une variable globale io
let io: SocketIOServer;

// Fonction pour initialiser io
export function initializeIO(server: any) {
  io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:3000', // TODO : Remplacez par env.domain
      credentials: true
    }
  });

  // Gérer la connexion des sockets
  io.on('connection', (socket) => {
    console.log('A client just arrived with id:', socket.id);

    if (!socket.request.headers.cookie) {
      console.log('No cookie');
      return;
    }

    const cookies = cookie.parse(socket.request.headers.cookie);
    const { token } = cookies;

    if (!token || token === 'Bearer undefined') {
      console.log('No token');
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
      console.log('Invalid token');
      return;
    }

    socket.join(decoded.id.toString());
    console.log('User', decoded.id, 'just joined');

    socket.on('disconnect', () => {
      console.log('A client has just left');

      socket.leave(decoded.id.toString());
    });

    socket.on('message', (data) => {
      console.log('Message from client:', data);
      socket.emit('message', 'Hello from server');
    });
  });
}

// Fonction pour envoyer une notification
export const sendNotification = async (userId: string, body: Notification):Promise<boolean> => {
  const { content } = body;

  if (!content || content.length < 1) {
    return false;
  }

  io.to(userId).emit('notification', body.content);

  return await addNotification(Number(userId), body);
}
