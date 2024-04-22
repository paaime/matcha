import http from 'http';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';

import userGet from './api/user/get';
import userPost from './api/user/post';
import userPut from './api/user/put';
import authGet from './api/auth/get';
import authPost from './api/auth/post';
import chatPost from './api/chat/post';
import chatGet from './api/chat/get';

import { authCheck } from './middlewares/authCheck';
import { initializeIO } from './websocket/initializeIo';
import { randScript } from './api/auth/functions/randScript';

const PORT = process.env.BACK_PORT;

const app = express();
const server = http.createServer(app);

// Default message
app.get('/', (req: Request, res: Response) => {
  res.send('API is running !');
});

// Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // ! development
app.use('/uploads', express.static(path.join(__dirname, "..", "public", "uploads"))); // ! production

// Middlewares
app.use(
  cors({
    origin: process.env.DOMAIN,
    credentials: true,
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
app.use('/user', userGet, userPost, userPut);

// Chat routes
app.use('/chat', chatGet, chatPost);

// Initialiser IO
initializeIO(server);

// Start web server
server.listen(PORT, async () => {
  await randScript();

  console.log(
    `API and WebSocket server is running at ${process.env.NEXT_PUBLIC_API}`
  );
});

// Create mail transporter
export const transporter = nodemailer.createTransport({
  port: process.env.MAIL_PORT as unknown as number,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: true,
});
