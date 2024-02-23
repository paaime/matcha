'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const Match = () => {
  return (
    <Image
      src="/img/placeholder/users/1.jpg"
      alt="LoveCard1"
      width={200}
      height={300}
      className="rounded-lg w-24 h-28 object-cover"
      priority
    />
  );
};

export default function Matches() {
  return (
    <Swiper
      slidesPerView={3.3}
      spaceBetween={20}
      pagination={{
        clickable: true,
      }}
      className="shadow-scroll !-ml-5 sm:!ml-auto !pl-5"
      breakpoints={{
        580: {
          slidesPerView: 4.5,
        },
      }}
    >
      <SwiperSlide>
        <Match />
      </SwiperSlide>
      <SwiperSlide>
        <Match />
      </SwiperSlide>
      <SwiperSlide>
        <Match />
      </SwiperSlide>
      <SwiperSlide>
        <Match />
      </SwiperSlide>
      <SwiperSlide>
        <Match />
      </SwiperSlide>
    </Swiper>
  );
}
