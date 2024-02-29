'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';

const AvatarCard = ({ user }: { user: IUser }) => {
  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex gap-1 flex-col items-center"
    >
      <div className="border-2 border-blue-400 rounded-full p-1">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user?.pictures} />
          <AvatarFallback>{user.firstName}</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm">{user.firstName}</p>
    </Link>
  );
};

export default function AvatarCarousel() {
  const [users, setUsers] = useState<IUser[]>([]);

  const getUsers = async () => {
    try {
      const res = await customAxios.get('/user');
      setUsers(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while fetching users' });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

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
        {users?.map((user, index) => (
          <SwiperSlide key={index}>
            <AvatarCard user={user} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
