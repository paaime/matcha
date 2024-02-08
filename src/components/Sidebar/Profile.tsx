'use client';

import { useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import ThemeSwitch from '../ThemeSwitch';
import SignOut from '../Header/SignOut';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Profile({ isMobile }: { isMobile: boolean }) {
  const { data, status } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={clsx(
            'flex items-center gap-x-4 text-sm font-semibold leading-6 text-white'
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {!isMobile && (
            <span aria-hidden="true" className="text-black dark:text-white">
              {data?.user?.lastName} {data?.user?.firstName}
            </span>
          )}
          {!isMobile && (
            <ChevronDownIcon
              className="-ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" style={{ marginRight: '20px' }}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeSwitch />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
