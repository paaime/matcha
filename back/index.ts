import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

import userGet from './api/user/get';
import userPost from './api/user/post';
import authGet from './api/auth/get';
import authPost from './api/auth/post';
import searchGet from './api/search/get';
import socketws from './websocket/post';
import { authCheck } from './middlewares/authCheck';
import { initializeIO } from './websocket/functions/initializeIo';

const PORT = process.env.BACK_PORT;

const app = express();
const server = http.createServer(app);

// Default message
app.get('/', (req: Request, res: Response) => {
  res.send('API is running !');
});

// Middlewares
app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

// Notification route (WebSocket)
app.use('/notification', socketws);

// Start web server
server.listen(PORT, () => {
  console.log(
    `API and WebSocket server is running at http://localhost:${PORT}`
  );
});

// Create mail transporter
export const transporter = nodemailer.createTransport({
  port: process.env.MAIL_PORT as unknown as number,
  host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
  secure: true,
});