/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, StarIcon, XIcon } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';
import LoveCard from './LoveCard';
import Header from './Header';
import { useCarouselStore } from '@/store';
import { updateCoords } from '@/utils/updateCoords';

const easeOutExpo = [0.16, 1, 0.3, 1];

export default function LoveCarousel() {
  const { users, setUsers } = useCarouselStore();
  const [direction, setDirection] = useState<'left' | 'right' | ''>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    updateCoords().then((location: string) => {
      // console.log(location);

      customAxios.put('/user/location', {
        location
      })
    })
  }, []);

  useEffect(() => {
    setCurrentIndex(users.length - 1);
  }, [users]);

  useEffect(() => {
    if (['left', 'right'].includes(direction)) {
      setUsers(users.slice(0, -1));
    }
    setDirection('');
  }, [direction]);

  const swipeLeft = async () => {
    if (currentIndex === -1) return;
    setCurrentIndex(currentIndex - 1);
    setDirection('left');
  };

  const swipeRight = async () => {
    if (currentIndex === -1) return;
    try {
      await customAxios.post(`/user/like/${users[currentIndex].id}`);
      setCurrentIndex(currentIndex - 1);
      setDirection('right');
    } catch (err) {
      // console.log(err);
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else
        toast('An error occured', {
          description: 'Error',
        });
    }
  };

  const superLike = async () => {
    if (currentIndex === -1) return;
    try {
      await customAxios.post(`/user/like/${users[currentIndex].id}`, {
        superLike: true,
      });
      setCurrentIndex(currentIndex - 1);
      setDirection('right');
    } catch (err) {
      // console.log(err);
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else
        toast('An error occured', {
          description: 'Error',
        });
    }
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
      <Header />
      <div
        className="flex flex-col bg-white dark:bg-gray-950 rounded-3xl shadow-xl p-3 z-10 dark:border dark:border-input"
        style={{ height: 'calc(100vh - 285px)', minHeight: '250px' }}
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
                  height: 'calc(100vh - 405px)',
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
              '!h-14 !w-14 !rounded-full bg-white shadow-xl text-black ',
              buttonVariants({ variant: 'secondary' })
            )}
          >
            <XIcon className="dark:text-black" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={superLike}
            className={clsx(
              '!h-14 !w-14 !rounded-full !bg-primary dark:!bg-[#4a154b] shadow-xl text-white',
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
      <div className="mx-auto w-11/12 bg-white dark:bg-gray-950 rounded-3xl shadow-2xl h-[60px] mt-[-70px] dark:border dark:border-input"></div>
    </>
  );
}
