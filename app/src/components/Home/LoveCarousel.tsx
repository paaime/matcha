'use client';

import { HeartIcon, StarIcon, XIcon } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import CircleProgress from '../ui/CircleProgress';
import TinderCard from 'react-tinder-card';
import React, { createRef, useMemo, useRef, useState } from 'react';
import { fakeUsers } from '@/fakeUsers';
import { IProfile } from '@/types/profile';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const LoveCard = ({ user }: { user: IProfile }) => {
  return (
    <div
      // href="/profile"
      className="rounded-3xl block h-full"
    >
      <Swiper
        direction={'vertical'}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="!absolute w-full rounded-3xl h-full !z-0"
      >
        <SwiperSlide>
          <Image
            src={user.image}
            alt={user.name}
            width={500}
            height={500}
            className="absolute w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={user.image}
            alt={user.name}
            width={500}
            height={500}
            className="absolute w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
      <div
        className="flex flex-col justify-between p-5 h-full love-card rounded-3xl relative pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 30%)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
            <p>{user.distance} km away</p>
          </div>
          <CircleProgress />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <p className="font-extrabold text-white text-3xl">
              {user.name}, {user.age}
            </p>
            <div className="bg-green-300 h-2.5 w-2.5 rounded-full" />
          </div>
          <p className="text-[#C0AFC0] font-semibold tracking-wider uppercase">
            {user.location}
          </p>
        </div>
      </div>
    </div>
  );
};

type Direction = 'left' | 'right' | 'up' | 'down';

interface API {
  swipe(dir?: Direction): Promise<void>;
  restoreCard(): Promise<void>;
}

export default function LoveCarousel() {
  const [currentIndex, setCurrentIndex] = useState(fakeUsers.length - 1);
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(fakeUsers.length)
        .fill(0)
        .map((i) => createRef<API>()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (index) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < fakeUsers.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  return (
    <>
      <div
        className="flex flex-col bg-white rounded-3xl shadow-xl p-3 z-10"
        style={{ height: 'calc(100vh - 335px)', minHeight: '250px' }}
      >
        <div className="relative w-full h-full">
          {fakeUsers.map((user, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="tinder-card absolute"
              key={index}
              onSwipe={(dir) => swiped(index)}
              preventSwipe={['up', 'down']}
              onCardLeftScreen={() => outOfFrame(index)}
            >
              <LoveCard user={user} key={index} />
            </TinderCard>
          ))}
          {currentIndex === -1 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{
                height: 'calc(100vh - 450px)',
                minHeight: '250px',
              }}
            >
              <p className="text-lg font-bold">No more suggestions</p>
              <p className="text-gray-400">
                You can still discover other profile
              </p>
              <Link
                href="/discover"
                className={clsx(
                  '!rounded-full !font-bold mt-3 ',
                  buttonVariants({ variant: 'default' })
                )}
              >
                Discover
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-8 justify-center pb-4 pt-6 mt-auto">
          <Button
            className="h-14 w-14 rounded-full bg-white shadow-xl text-black"
            onClick={() => swipe('left')}
            variant="secondary"
          >
            <XIcon />
          </Button>
          <Button className="h-14 w-14 rounded-full bg-primary shadow-xl text-white">
            <StarIcon className="fill-white" />
          </Button>
          <Button
            className="h-14 w-14 rounded-full bg-pink shadow-xl text-white"
            onClick={() => swipe('right')}
          >
            <HeartIcon className="fill-white" />
          </Button>
        </div>
      </div>
      <div className="mx-auto w-11/12 bg-white rounded-3xl shadow-2xl h-[60px] mt-[-70px]"></div>
    </>
  );
}
