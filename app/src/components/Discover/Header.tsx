'use client';

import { MapPinIcon } from 'lucide-react';
import Filters from './Filters';
import { useUserStore } from '@/store';

export default function Header() {
  const { user } = useUserStore();

  const city = user?.consentLocation ? user?.city : 'Everywhere';

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <MapPinIcon className="h-4 w-4 stroke-pink" />
          <span className="text-sm font-semibold">
            {city || 'Everywhere'}
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-black dark:text-white">
          Discover
        </h2>
        <p className="text-gray-400">Our last members</p>
      </div>

      <div className="flex gap-3 items-center">
        <Filters />
      </div>
    </div>
  );
}
