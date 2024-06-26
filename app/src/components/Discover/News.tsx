'use client';
import ProfileCard from '../ProfileCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { ILove } from '@/types/user';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

export default function News() {
  const [users, setUsers] = useState<ILove[]>([]);

  const getUsers = async () => {
    try {
      const res = await customAxios.get('/user/discovery/news');
      setUsers(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while fetching users' });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (!users || users.length === 0) return null;

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
        className="!-ml-[20px] !pl-[20px]"
      >
        {users?.map((user, index) => {
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
