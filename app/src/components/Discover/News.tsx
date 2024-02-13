'use client';
import ProfileCard from '../ProfileCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { fakeUsers } from '@/fakeUsers';

export default function News() {
  return (
    <div>
      <Swiper
        slidesPerView={1.7}
        spaceBetween={15}
        breakpoints={{
          1024: {
            slidesPerView: 2.8,
          },
        }}
        className="shadow-scroll !-ml-[20px] !pl-[20px]"
      >
        {fakeUsers.map((user, index) => {
          return (
            <SwiperSlide key={index}>
              <ProfileCard small={true} user={user} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
