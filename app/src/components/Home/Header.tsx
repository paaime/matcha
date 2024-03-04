/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { ArrowDown01Icon, ArrowUp01Icon } from 'lucide-react';
import Filters from './Filters';
import { useCarouselStore } from '@/store';

export default function Header() {
  const { users, setUsers } = useCarouselStore();
  const [sort, setSort] = useState(null);
  const [ascending, setAscending] = useState(false);

  const handleSort = () => {
    if (!sort) return;
    switch (sort) {
      case 'location': {
        let newUsers = users.sort((a, b) => {
          if (ascending) {
            return a.distance - b.distance;
          } else {
            return b.distance - a.distance;
          }
        });
        setUsers(newUsers);
        break;
      }
      case 'age': {
        let newUsers = users.sort((a, b) => {
          if (ascending) {
            return a.age - b.age;
          } else {
            return b.age - a.age;
          }
        });
        setUsers(newUsers);
        break;
      }
      case 'fame': {
        let newUsers = users.sort((a, b) => {
          if (ascending) {
            return a.fameRating - b.fameRating;
          } else {
            return b.fameRating - a.fameRating;
          }
        });
        setUsers(newUsers);
        break;
      }
      case 'interests': {
        let newUsers = users.sort((a, b) => {
          if (ascending) {
            return a.compatibilityScore - b.compatibilityScore;
          } else {
            return b.compatibilityScore - a.compatibilityScore;
          }
        });
        setUsers(newUsers);
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
    <div className="flex justify-between">
      <Filters />
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
  );
}
