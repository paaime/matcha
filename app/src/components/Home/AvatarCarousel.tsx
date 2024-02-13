'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

const AvatarCard = () => {
  return (
    <Link href="/profile" className="flex gap-1 flex-col items-center">
      <div className="border-2 border-blue-400 rounded-full p-1">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm">Selena</p>
    </Link>
  );
};

export default function AvatarCarousel() {
  return (
    <div>
      <Swiper
        slidesPerView={4}
        spaceBetween={15}
        className="shadow-scroll"
        breakpoints={{
          550: {
            slidesPerView: 5,
          },
          650: {
            slidesPerView: 6,
          },
        }}
      >
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
        <SwiperSlide>
          <AvatarCard />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
