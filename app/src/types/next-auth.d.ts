import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    firstName: string;
    lastName: string;
    subscription: string | null;
    id: string;
  }
}

declare module 'next-auth' {
  interface User {
    firstName?: string | null;
    lastName?: string | null;
    subscription?: string | null;
    id: string;
  }
  interface Session {
    user: User;
  }
}
