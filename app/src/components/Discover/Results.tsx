'use client';

import Link from 'next/link';
import ProfileCard from '../ProfileCard';
import clsx from 'clsx';
import { buttonVariants } from '../ui/button';
import { useState } from 'react';
import { IUser } from '@/types/user';

export default function Results() {
  const [results, setResults] = useState<IUser[]>([]);
  return (
    <div>
      <p className="text-xl text-black font-extrabold">
        Results{' '}
        <span className="text-pink">
          {results.length > 0 ? results.length : ''}
        </span>
      </p>
      <p className="text-gray-400">Some people you might like</p>
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-lg font-bold">We haven&apos;t found anyone</p>
        <p className="text-gray-400">You can still discover other profile</p>
        <Link
          href="/"
          className={clsx(
            '!rounded-full !font-bold mt-3 ',
            buttonVariants({ variant: 'default' })
          )}
        >
          Find love
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {/* {fakeUsers.map((user, index) => {
          return <ProfileCard key={index} user={user} />;
        })} */}
      </div>
    </div>
  );
}
