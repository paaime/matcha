'use client';

import { MapPinIcon, SearchIcon } from 'lucide-react';
import Search from './Search';
import { Button } from '../ui/button';
import Filters from './Filters';
import { useState } from 'react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="flex justify-between">
      {searchOpen ? (
        <Search />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <MapPinIcon className="h-4 w-4 stroke-pink" />
            <span className="text-sm font-semibold">Lyon</span>
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
