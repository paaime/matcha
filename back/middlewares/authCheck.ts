import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { JwtDatas } from '../types/type';
import { RequestUser } from '../types/express';
import { connectToDatabase } from '../utils/db';

export const authCheck = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from cookie
  const token = req.cookies?.token;

  if (!token || token === 'Bearer undefined') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token is missing',
    });
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
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  const db = await connectToDatabase();

  if (!db) {
    return res.status(400).json({
      error: 'Internal server error',
      message: 'Database connection error',
    });
  }

  // Check if user'id is user'email
  const check = await db.query('SELECT username FROM User WHERE id = ? AND email = ?', [
    decoded.id,
    decoded.email,
  ]) as any;

  if (!check || check.length === 0) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User not found',
    });
  }

  // Add user to request
  req.user = decoded;

  return next();
};

export const getAuthId = (req: RequestUser): number => {
  const decodedId = req.user?.id as number;

  if (!decodedId || !Number.isInteger(decodedId) || decodedId < 1) {
    return -1;
  }

  return decodedId;
};

export const safeUserId = (id: number): boolean => {
  // Checl if is a positive finite integer
  if (!id || !Number.isInteger(id) || id < 1) {
    return false;
  }
  return true;
};
