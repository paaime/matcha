'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { AiOutlineMan } from 'react-icons/ai';
import { StaticInterest } from '../Discover/Interests';
import clsx from 'clsx';
import { CalendarDaysIcon, FlameIcon } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { IUser } from '@/types/user';

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function Informations({ user }: { user: IUser }) {
  const [snap, setSnap] = useState<number | string | null>(0.35);

  // Function to calculate elapsed time (ex: 10 minutes ago)
  const timeSince = (date: string) => {
    if (!date || date === "") return 'Unknown';

    const seconds = Math.abs(Math.floor((new Date().getTime() - new Date(date).getTime())) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '');
    }
    return Math.floor(seconds) + ' second' + (Math.floor(seconds) > 1 ? 's' : '');
  }

  const getGender = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Man';
      case 'female':
        return 'Woman';
      default:
        return 'Other';
    }
  }

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
            <p className="font-semibold text-dark">{user.biography}</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-gray-400 font-semibold">Interests</p>
            <div className="flex flex-wrap gap-3">
              {user.interests?.map((interest, i) => (
                <StaticInterest value={interest} key={i} />
              ))}

              {user.interests?.length === 0 && (
                <p className="text-gray-400 font-semibold">
                  No interests to show
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-around bg-light-pink -mx-10 py-5">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center bg-pink h-12 w-12 rounded-full">
                <AiOutlineMan className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-400 mt-3">Gender</p>
              <p className="text-primary font-semibold text-lg">
                {getGender(user.gender)}
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

            {user.consentLocation && user.loc ? (
              <Map user={user} />
            ) : (
              <p className="font-semibold text-dark">
                {user.firstName} has disabled location or you don{"'"}t have consent
              </p>
            )}

          </div>

          {!user.isMatch && user.isLiked && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 font-semibold">
                You {user.isSuperLike && "super"} liked {user.firstName} {user.isSuperLike && " ⭐️"}
              </p>
              <p className="font-semibold text-dark">
                {timeSince(user.isLikeTime)} ago
              </p>
            </div>
          )}

          {!user.isMatch && user.hasLiked && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 font-semibold">
                {user.firstName} {user.hasSuperLike && "super"} liked you {user.hasSuperLike && " ⭐️"}
              </p>
              <p className="font-semibold text-dark">
                {timeSince(user.hasLikeTime)} ago
              </p>
            </div>
          )}

          {user.hasBlocked || user.isBlocked && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 font-semibold">
                Block section
              </p>
              <p className="font-semibold text-dark">
                {user.isBlocked ? 'You blocked' : 'You are blocked by'} {user.firstName}
              </p>
            </div>
          )}

          {user.isMatch && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 font-semibold">
                You matched with {user.firstName}
              </p>
              <p className="font-semibold text-dark">
                {timeSince(user.matchTime)} ago

                <br />

                {user.isSuperLike && user.hasSuperLike && "You both super liked each other ⭐️⭐️"}
                {user.isSuperLike && !user.hasSuperLike && "You super liked ⭐️"}
                {!user.isSuperLike && user.hasSuperLike && "You were super liked ⭐️"}
              </p>
            </div>
          )}

          {user.isOnline === false && (
            <div className="flex flex-col gap-3">
              <p className="text-gray-400 font-semibold">Last seen</p>
              <p className="font-semibold text-dark">
                {timeSince(user.lastConnection)} ago
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
