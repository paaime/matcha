'use client';

import Link from 'next/link';
import ProfileCard from '../ProfileCard';
import clsx from 'clsx';
import { Button, buttonVariants } from '../ui/button';
import { useDiscoverStore } from '@/store';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDown01Icon, ArrowUp01Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Results() {
  const [ascending, setAscending] = useState(false);
  const [sort, setSort] = useState(null);
  const { discover, setDiscover } = useDiscoverStore();

  const handleSort = () => {
    if (!sort) return;
    switch (sort) {
      case 'location': {
        let newDiscover = discover.sort((a, b) => {
          if (ascending) {
            return a.distance - b.distance;
          } else {
            return b.distance - a.distance;
          }
        });
        setDiscover(newDiscover);
        break;
      }
      case 'age': {
        let newDiscover = discover.sort((a, b) => {
          if (ascending) {
            return a.age - b.age;
          } else {
            return b.age - a.age;
          }
        });
        setDiscover(newDiscover);
        break;
      }
      case 'fame': {
        let newDiscover = discover.sort((a, b) => {
          if (ascending) {
            return a.fameRating - b.fameRating;
          } else {
            return b.fameRating - a.fameRating;
          }
        });
        setDiscover(newDiscover);
        break;
      }
      case 'interests': {
        let newDiscover = discover.sort((a, b) => {
          if (ascending) {
            return a.compatibilityScore - b.compatibilityScore;
          } else {
            return b.compatibilityScore - a.compatibilityScore;
          }
        });
        setDiscover(newDiscover);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    handleSort();
  }, [sort, ascending]);

  return (
    <div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <p className="text-xl text-black dark:text-white font-extrabold">
            Results{' '}
            <span className="text-pink">
              {discover.length > 0 ? discover.length : ''}
            </span>
          </p>

          <p className="text-gray-400">Some people you might like</p>
        </div>
        <div className="flex gap-3">
          <Select onValueChange={(value) => setSort(value)}>
            <SelectTrigger className="w-auto text-gray-400 font-bold border-0 text-md">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="fame">Fame</SelectItem>
                <SelectItem value="interests">Interests</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="!rounded-lg border-none h-10 w-10"
            onClick={() => setAscending(!ascending)}
          >
            {ascending ? (
              <ArrowDown01Icon className="h-5 w-5" />
            ) : (
              <ArrowUp01Icon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {discover.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-lg font-bold">We haven&apos;t found anyone</p>
          <p className="text-gray-400">You can still discover other profile</p>
          <Link
            href="/"
            className={clsx(
              '!rounded-full !font-bold mt-3 ',
              buttonVariants({ variant: 'default' })
            )}
          >
            Find love
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {discover.map((user, index) => {
          return <ProfileCard key={index} user={user} />;
        })}
      </div>
    </div>
  );
}
