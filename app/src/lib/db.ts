import { PrismaClient } from '@prisma/client';
import 'server-only';

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

import mysql from 'serverless-mysql';

// const dba = mysql({
//   config: {
//     // host: process.env.MYSQL_HOST,
//     // port: parseInt(process.env.MYSQL_PORT || '3306'),
//     // database: process.env.MYSQL_DATABASE,
//     // user: process.env.MYSQL_USER,
//     // password: process.env.MYSQL_PASSWORD
//   }
// });
