'use client';

import { MapPinIcon } from 'lucide-react';
import Search from './Search';
import Filters from './Filters';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

export default function Header() {
  const { user } = useUserStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  // Re call the user to get the updated list of blocked, visited and history
  const getUser = async () => {
    try {
      const { data } = await customAxios.get('/user/me');
      setUser(data);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occured');
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex justify-between">
      {searchOpen ? (
        <Search />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <MapPinIcon className="h-4 w-4 stroke-pink" />
            <span className="text-sm font-semibold">
              {user?.city || 'Everywhere'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-black dark:text-white">
            Discover
          </h2>
          <p className="text-gray-400">Our last members</p>
        </div>
      )}
      <div className="flex gap-3 items-center">
        <Filters />
      </div>
    </div>
  );
}
