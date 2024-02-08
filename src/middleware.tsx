import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/sign-in',
  },
});

// Private routes
export const config = { matcher: ['/dashboard', '/favorites', '/collection'] };
