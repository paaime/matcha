'use client';

import { CircleProgress } from '../ui/CircleProgress';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { ILove } from '@/types/user';

export default function LoveCard({ user }: { user: ILove }) {
  const pictures = user.pictures?.split(',') || [];

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
        {pictures?.map((picture, index) => (
          <SwiperSlide key={index}>
            <Image
              loader={({ src }) => src}
              src={`${picture.startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${picture}`}
              alt={`Photo ${index}`}
              width={500}
              height={500}
              className="absolute w-full h-full object-cover"
              priority
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="flex flex-col justify-between p-5 h-full love-card rounded-3xl relative pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 30%)',
        }}
      >
        <div className="flex justify-between items-start">

          {user.distance && user.distance >= 0 ? (
            <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
              <p>{user.distance} km away</p>
            </div>
          ) : (
            <span></span>
          )}

          <CircleProgress percent={user.compatibilityScore} />
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
}
