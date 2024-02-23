import { JwtDatas } from './type';

declare global {
  namespace Express {
    export interface Request {
      user: JwtDatas;
    }
  }
}
