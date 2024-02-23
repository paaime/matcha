/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, StarIcon, XIcon } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import CircleProgress from '../ui/CircleProgress';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { IUser } from '@/types/user';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

const easeOutExpo = [0.16, 1, 0.3, 1];

const LoveCard = ({ user }: { user: IUser }) => {
  return (
    <div className="rounded-3xl block h-full w-full absolute">
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
            src={user.pictures}
            alt={user.firstName}
            width={500}
            height={500}
            className="absolute w-full h-full object-cover"
            priority
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={user.pictures}
            alt={user.firstName}
            width={500}
            height={500}
            className="absolute w-full h-full object-cover"
            priority
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
              {user.firstName}, {user.age}
            </p>
            <div className="bg-green-300 h-2.5 w-2.5 rounded-full" />
          </div>
          <p className="text-[#C0AFC0] font-semibold tracking-wider uppercase">
            {user.city}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LoveCarousel() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | ''>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getUsers = async () => {
    try {
      const res = await customAxios.get('/user/getlove');
      setUsers(res.data);
      setCurrentIndex(res.data.length - 1);
    } catch (err) {
      console.log(err);
      toast('Error', { description: 'An error occured while fetching data.' });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (['left', 'right'].includes(direction)) {
      setUsers(users.slice(0, -1));
    }
    setDirection('');
  }, [direction]);

  const swipeLeft = () => {
    if (currentIndex === -1) return;
    setCurrentIndex(currentIndex - 1);
    setDirection('left');
  };

  const swipeRight = () => {
    if (currentIndex === -1) return;
    setCurrentIndex(currentIndex - 1);
    setDirection('right');
  };

  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: easeOutExpo },
    },
    upcoming: {
      opacity: 0,
      y: 67,
      scale: 0.9,
      transition: { duration: 0.6, ease: easeOutExpo, delay: 0 },
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    exit: {
      opacity: 0,
      x: direction === 'left' ? -300 : 300,
      y: 40,
      rotate: direction === 'left' ? -20 : 20,
      transition: { duration: 0.8, ease: easeOutExpo },
    },
  };

  return (
    <>
      <div
        className="flex flex-col bg-white rounded-3xl shadow-xl p-3 z-10"
        style={{ height: 'calc(100vh - 205px)', minHeight: '250px' }}
      >
        <div className="relative w-full h-full">
          <AnimatePresence>
            {users?.map((user, index) => (
              <motion.div
                key={index}
                className="h-full absolute w-full"
                variants={cardVariants}
                initial="remainings"
                animate={
                  index === users.length - 1
                    ? 'current'
                    : index === users.length - 2
                    ? 'upcoming'
                    : 'remainings'
                }
                exit="exit"
              >
                <LoveCard user={user} key={index} />
              </motion.div>
            ))}
            {currentIndex === -1 && (
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  height: 'calc(100vh - 325px)',
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
          </AnimatePresence>
        </div>

        <div className="flex gap-8 justify-center pb-4 pt-6 mt-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={swipeLeft}
            className={clsx(
              '!h-14 !w-14 !rounded-full bg-white shadow-xl text-black',
              buttonVariants({ variant: 'secondary' })
            )}
          >
            <XIcon />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={clsx(
              '!h-14 !w-14 !rounded-full !bg-primary shadow-xl text-white',
              buttonVariants({ variant: 'secondary' })
            )}
          >
            <StarIcon className="fill-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={swipeRight}
            className={clsx(
              '!h-14 !w-14 !rounded-full !bg-pink shadow-xl text-white',
              buttonVariants({ variant: 'secondary' })
            )}
          >
            <HeartIcon className="fill-white" />
          </motion.button>
        </div>
      </div>
      <div className="mx-auto w-11/12 bg-white rounded-3xl shadow-2xl h-[60px] mt-[-70px]"></div>
    </>
  );
}
