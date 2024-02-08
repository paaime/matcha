'use client';

import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { formatPathname } from '@/utils/pathname';

export default function Menu() {
  const pathname = usePathname();
  const formattedPathname = formatPathname(pathname);

  return (
    <aside className="lg:-mx-4 lg:w-56 overflow-scroll lg:overflow-auto ">
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        <Link
          href="/settings"
          className={clsx(
            '!justify-start',
            buttonVariants({
              variant: formattedPathname === '/settings' ? 'secondary' : 'link',
            })
          )}
        >
          Account
        </Link>
        <Link
          href="/settings/security"
          className={clsx(
            '!justify-start',
            buttonVariants({
              variant:
                formattedPathname === '/settings/security'
                  ? 'secondary'
                  : 'link',
            })
          )}
        >
          Security
        </Link>

        <Link
          href="/settings/customization"
          className={clsx(
            '!justify-start',
            buttonVariants({
              variant:
                formattedPathname === '/settings/customization'
                  ? 'secondary'
                  : 'link',
            })
          )}
        >
          Customization
        </Link>

        <Link
          href="/settings/privacy"
          className={clsx(
            '!justify-start',
            buttonVariants({
              variant:
                formattedPathname === '/settings/privacy'
                  ? 'secondary'
                  : 'link',
            })
          )}
        >
          Privacy
        </Link>
      </nav>
    </aside>
  );
}
