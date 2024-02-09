'use client';

import clsx from 'clsx';
import {
  CompassIcon,
  HomeIcon,
  MessageCircleIcon,
  PlusIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu() {
  const pathname = usePathname();
  return (
    <header className="flex w-full justify-center fixed bottom-5 h-16 z-20">
      <nav className="flex items-center bg-white px-5 rounded-full gap-6 shadow-lg">
        <Link
          href="/"
          className={clsx(
            pathname === '/' ? 'text-white bg-pink' : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center '
          )}
        >
          <HomeIcon />
        </Link>
        <Link
          href="/discover"
          className={clsx(
            pathname === '/discover' ? 'text-white bg-pink' : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center '
          )}
        >
          <CompassIcon />
        </Link>
        <Link
          href="/home"
          className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400"
        >
          <PlusIcon />
        </Link>
        <Link
          href="/home"
          className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400"
        >
          <UsersIcon />
        </Link>
        <Link
          href="/home"
          className="h-10 w-10 rounded-full flex items-center justify-center text-gray-400"
        >
          <MessageCircleIcon />
        </Link>
      </nav>
    </header>
  );
}
