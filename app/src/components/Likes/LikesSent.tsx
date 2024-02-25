'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';
import ProfileCard from '../ProfileCard';

export default function LikesSent() {
  const [users, setUsers] = useState<IUser[]>([]);

  const getUsers = async () => {
    try {
      const res = await customAxios.get('/user/getLikesSent');
      setUsers(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while fetching users' });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <p className="text-xl text-black font-extrabold">People you liked</p>
      <p className="text-gray-400">Maybe they will like you too</p>
      {users?.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          {users?.map((user, index) => {
            return <ProfileCard key={index} user={user} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-lg font-bold">You haven&apos;t liked anyone yet</p>
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
      )}
    </div>
  );
}
