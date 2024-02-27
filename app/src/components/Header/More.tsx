'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import customAxios from '@/utils/axios';
import { LogOutIcon, MoreHorizontalIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function More() {
  const { setTheme, resolvedTheme } = useTheme();

  const logout = async () => {
    await customAxios.post('/auth/logout');
    window.location.href = '/';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full h-10 w-10">
          <MoreHorizontalIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 z-50">
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? (
            <SunIcon className="h-4 w-4 mr-2" />
          ) : (
            <MoonIcon className="h-4 w-4 mr-2" />
          )}
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOutIcon className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
