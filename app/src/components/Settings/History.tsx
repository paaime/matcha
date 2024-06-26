'use client';
import ProfileCard from '../ProfileCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useUserStore } from '@/store';
import { ILove } from '@/types/user';

export default function History() {
  const user = useUserStore((state) => state.user);

  const users = user?.visitHistory as unknown as ILove[];

  if (!users || users.length === 0) return null;

  return (
    <div className="my-3">
      <div className="flex justify-between py-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold text-black dark:text-white">
            History
          </h2>
          <p className="text-gray-400">
            Here are the people you have consulted
          </p>
        </div>
      </div>

      <Swiper
        slidesPerView={1.7}
        spaceBetween={15}
        breakpoints={{
          1024: {
            slidesPerView: 2.8,
          },
        }}
        className="!-ml-[20px] !pl-[20px]"
      >
        {users?.map((user, index) => {
          return (
            <SwiperSlide key={index}>
              <ProfileCard preview={true} user={user} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
