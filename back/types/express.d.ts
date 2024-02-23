import { Request } from 'express';
import { JwtDatas } from './type';

declare global {
  namespace Express {
    export interface Request {
      user: JwtDatas;
    }
  }
}

export interface RequestUser extends Request {
  user: JwtDatas;
}