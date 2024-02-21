'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { IUser } from '@/types/user';

export default function Gallery({ user }: { user: IUser }) {
  return (
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
          alt={'Photo 1'}
          width={500}
          height={500}
          className="absolute w-full h-full"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src={user.pictures}
          alt={'Photo 2'}
          width={500}
          height={500}
          className="absolute w-full h-full"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      </SwiperSlide>
    </Swiper>
  );
}
