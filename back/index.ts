import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userGet from './api/user/get';
import userPost from './api/user/post';
import authGet from './api/auth/get';
import authPost from './api/auth/post';
import searchGet from './api/search/get';
import { authCheck } from './middlewares/authCheck';

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

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/auth', authGet);
app.use('/auth', authPost);
app.use('/auth', authGet);
// Auth middleware
app.use(authCheck);
// User routes
app.use('/user', userGet);
app.use('/user', userPost);
// Search routes
app.use('/search', searchGet);

io.on('connection', (socket) => {
  console.log('A client just arrived with id:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client has just left');
  });

  socket.on('message', (data) => {
    console.log('Message from client:', data);
    socket.emit('message', 'Hello from server');
  });
});

// Start web server
server.listen(PORT, () => {
  console.log(
    `API and WebSocket server is running at http://localhost:${PORT}`
  );
});
