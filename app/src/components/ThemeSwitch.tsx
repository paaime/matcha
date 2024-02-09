'use client';

import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div
      className={'flex items-center'}
      onClick={() => {
        if (resolvedTheme === 'light') setTheme('dark');
        else setTheme('light');
      }}
    >
      {resolvedTheme === 'light' ? (
        <MoonIcon className="h-4 w-4 mr-2 shrink-0" />
      ) : (
        <SunIcon className="h-4 w-4 mr-2 shrink-0" />
      )}
      {resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode
    </div>
  );
}
