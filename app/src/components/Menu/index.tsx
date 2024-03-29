'use client';

import clsx from 'clsx';
import {
  CompassIcon,
  HomeIcon,
  MapIcon,
  MessageCircleIcon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Menu() {
  const [x, setX] = useState(6);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case '/':
        setX(6);
        break;
      case '/discover':
        setX(25);
        break;
      case '/likes':
        setX(43.8);
        break;
      case '/messages':
        setX(63);
        break;
      case '/map':
        setX(82.2);
        break;
      default:
        setX(0);
        break;
    }
  }, [pathname]);

  useEffect(() => setIsMounted(true), []);

  return (
    <header className="flex w-full justify-center fixed bottom-5 h-16 z-10">
      <nav className="flex items-center bg-white dark:bg-gray-950 dark:border dark:border-input px-5 rounded-full gap-6 shadow-lg relative">
        {isMounted && (
          <div
            className="h-10 w-10 bg-pink rounded-full transition-all duration-300 absolute"
            style={{
              left: `${x}%` || '6%',
              opacity: x === 0 ? 0 : 1,
            }}
          />
        )}
        <Link
          href="/"
          className={clsx(
            isMounted && pathname === '/' ? 'text-white' : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center text-gray-400 z-10 transition-all duration-300'
          )}
        >
          <HomeIcon />
        </Link>
        <Link
          href="/discover"
          className={clsx(
            isMounted && pathname === '/discover'
              ? 'text-white'
              : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center z-10'
          )}
        >
          <CompassIcon />
        </Link>
        <Link
          href="/likes"
          className={clsx(
            isMounted && pathname === '/likes' ? 'text-white' : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center z-10'
          )}
        >
          <UsersIcon />
        </Link>
        <Link
          href="/messages"
          className={clsx(
            (isMounted && pathname === '/messages') || pathname === '/chat'
              ? 'text-white'
              : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center z-10'
          )}
        >
          <MessageCircleIcon />
        </Link>
        <Link
          href="/map"
          className={clsx(
            isMounted && pathname === '/map' ? 'text-white' : 'text-gray-400',
            'h-10 w-10 rounded-full flex items-center justify-center z-10'
          )}
        >
          <MapIcon />
        </Link>
      </nav>
    </header>
  );
}
