'use client';

import { FaGoogle } from 'react-icons/fa';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Google() {
  const getGoogleOAuthURL = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full text-black dark:text-white"
      asChild
    >
      <Link href={getGoogleOAuthURL()} className="w-full flex items-center justify-center">
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </Link>
    </Button>
  );
}
