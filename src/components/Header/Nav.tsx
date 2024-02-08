'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <Link
        href="/dashboard"
        className={clsx(
          pathname.includes('/dashboard') ? '' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/subscriber-only"
        className={clsx(
          pathname.includes('/subscriber-only') ? '' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Subscriber
      </Link>
      <Link
        href="/settings"
        className={clsx(
          pathname.includes('/settings') ? '' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
