/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import { HeartIcon, HeartOffIcon, NavigationIcon } from 'lucide-react';
import More from '@/components/Profile/More';
import Informations from '@/components/Profile/Informations';
import GoBack from '@/components/GoBack';
import Gallery from '@/components/Profile/Gallery';
import { IUser } from '@/types/user';
import { useEffect, useState } from 'react';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

export default function Page({ params }) {
  const id = params.id;

  const [user, setUser] = useState<IUser>(null);

  const getUser = async () => {
    try {
      const res = await customAxios.get(`/user/${id}`);
      setUser(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while fetching users' });
    }
  };

  const likeUser = async () => {
    try {
      if (user.isLiked) {
        await customAxios.post(`/user/unlike/${user.id}`);
        setUser({ ...user, isLiked: false });
      } else {
        await customAxios.post(`/user/like/${user.id}`);
        setUser({ ...user, isLiked: true });
      }
    } catch (err) {
      // console.log(err);
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occured while liking user');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return null;

  return (
    <>
      <div
        className="sm:rounded-3xl -mx-7 sm:mx-auto relative"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 'calc(70vh - 50px)',
          minHeight: '250px',
        }}
      >
        <Gallery user={user} />
        <div
          className="flex flex-col justify-between p-5 h-full love-card rounded-3xl relative pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 40%)',
          }}
        >
          <div className="flex justify-between items-start pointer-events-auto">
            <GoBack white={true} />
            <div className="flex gap-3">
              {user.isOnline && (
                <div className="flex gap-2 items-center border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
                  <div className="bg-green-300 h-2.5 w-2.5 rounded-full" />
                  <p>Online</p>
                </div>
              )}

              {user.distance && user.distance >= 0 && (
                <div className="flex gap-2 items-center border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
                  <NavigationIcon className="h-4 w-4" />
                  <p>{user.distance} km</p>
                </div>
              )}
              <More user_id={user.id} isBlocked={user.isBlocked} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 pb-10">
            <Button
              className="h-12 w-12 mb-1 rounded-full bg-pink shadow-xl text-white group pointer-events-auto"
              onClick={likeUser}
            >
              {user?.isLiked ? (
                <HeartOffIcon className="group-hover:fill-white" />
              ) : (
                <HeartIcon className="group-hover:fill-white" />
              )}
            </Button>
            <p className="font-extrabold text-white text-3xl">
              {user?.firstName}, {user?.age}
            </p>
            <p className="text-[#C0AFC0] font-semibold tracking-wider uppercase">
              {user?.city}
            </p>
          </div>
        </div>
      </div>
      <Informations user={user} />
    </>
  );
}
