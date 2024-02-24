import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userGet from './api/user/get';
import userPost from './api/user/post';
import authGet from './api/auth/get';
import authPost from './api/auth/post';
import searchGet from './api/search/get';
import socketws from './websocket/post';
import { authCheck } from './middlewares/authCheck';
import { initializeIO } from './websocket/functions/initializeIo';

const PORT = 3001;

const app = express();
const server = http.createServer(app);

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


  
// Route de notification
app.use('/notification', socketws); // Utilisez votre route de notification ici

// Auth routes
app.use('/auth', authGet, authPost);

// Auth middleware
app.use(authCheck);

// User routes
app.use('/user', userGet, userPost);

// Search routes
app.use('/search', searchGet);

// Initialiser IO
initializeIO(server);

// Start web server
server.listen(PORT, () => {
  console.log(
    `API and WebSocket server is running at http://localhost:${PORT}`
  );
});
