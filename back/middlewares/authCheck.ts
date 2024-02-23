import { NextFunction, Request, Response } from 'express';
import { JwtDatas } from '../types/type';

import jwt from 'jsonwebtoken';

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
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

  req.user = decoded;
  return next();
};
