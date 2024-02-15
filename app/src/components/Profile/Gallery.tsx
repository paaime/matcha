'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

export default function Gallery() {
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
          src={'/img/placeholder/users/1.jpg'}
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
          src={'/img/placeholder/users/1.jpg'}
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
