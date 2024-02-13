'use client';

import { Drawer, DrawerContent, DrawerOverlay } from '@/components/ui/drawer';
import { AiOutlineMan } from 'react-icons/ai';
import Map from './Map';
import { Interest } from '../Discover/Interests';
import clsx from 'clsx';
import { CalendarDaysIcon, FlameIcon } from 'lucide-react';
import { useState } from 'react';
import { IProfile } from '@/types/profile';

export default function Informations({ user }: { user: IProfile }) {
  const [snap, setSnap] = useState<number | string | null>(0.35);
  return (
    <Drawer
      shouldScaleBackground={true}
      snapPoints={[0.35, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      open={true}
      dismissible={false}
      modal={false}
    >
      <DrawerContent className="max-w-[600px] mx-auto rounded-t-3xl max-h-[97%] focus:outline-none">
        <div
          className={clsx(
            'flex flex-col gap-5 mx-auto w-full p-5 md:p-10 pt-5',
            {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            }
          )}
        >
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 font-semibold">About</p>
            <p className="font-semibold text-dark">{user.about}</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 font-semibold">Interest</p>
            <div className="flex flex-wrap gap-3">
              <Interest value="🎵 Music" />
              <Interest value="🚀 Travel" />
              <Interest value="🍔 Food" />
              <Interest value="💙 Fashion" />
              <Interest value="💻 Technology" />
              <Interest value="🕹️ Gaming" />
            </div>
          </div>
          <div className="flex justify-around bg-light-pink -mx-10 py-5">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-pink h-12 w-12 rounded-full">
                <AiOutlineMan className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-400 mt-3">Gender</p>
              <p className="text-primary font-semibold text-lg">
                {user.gender}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-pink h-12 w-12 rounded-full">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-400 mt-3">Age</p>
              <p className="text-primary font-semibold text-lg">
                {user.age} years old
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-pink h-12 w-12 rounded-full">
                <FlameIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-400 mt-3">Fame rating</p>
              <p className="text-primary font-semibold text-lg">
                {user.fameRating}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 font-semibold">Location</p>
            <Map user={user} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 font-semibold">Last seen</p>
            <p className="font-semibold text-dark">10 minutes ago</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
