'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { IUser } from '@/types/user';

export default function Gallery({ user }: { user: IUser }) {
  const pictures = user.pictures?.split(',') || [];

  return (
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
            className="absolute w-full h-full bg-gray-700"
            style={{
              objectFit: 'cover',
            }}
            priority
            unoptimized
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
