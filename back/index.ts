import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import userGet from './api/user/get';
import userPost from './api/user/post';

const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

// Default message
app.get('/', (req: Request, res: Response) => {
  res.send('API is running !');
});

// User routes
app.use('/user', userGet);
app.use('/user', userPost);

io.on('connection', (socket) => {
  console.log('A client just arrived with id:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client has just left');
  });
});

// Start web server
server.listen(PORT, () => {
  console.log(`API and WebSocket server is running at http://localhost:${PORT}`);
});
