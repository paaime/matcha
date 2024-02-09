'use client';
import ProfileCard from '../ProfileCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

export default function News() {
  return (
    <div>
      <Swiper
        slidesPerView={2.2}
        spaceBetween={15}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
        breakpoints={{
          1024: {
            slidesPerView: 3.2,
          },
        }}
      >
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
        <SwiperSlide>
          <ProfileCard small={true} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
