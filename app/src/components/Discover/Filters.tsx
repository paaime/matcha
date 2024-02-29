import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';
import { Settings2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Filters } from '@/types/type';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';
import {
  useDiscoverStore,
  useFiltersStore,
  useInterestsListStore,
  useInterestsStore,
} from '@/store';

const getResultsLink = (filters: Filters, interests: string[]) => {
  const { minAge, maxAge, minFameRating, maxFameRating, maxDistance } = filters;

  const interestsString = interests.join(',')?.replaceAll('#', '');

  return `/user/discovery/results?minAge=${minAge}&maxAge=${maxAge}&minFame=${minFameRating}&maxFame=${maxFameRating}&maxDistance=${maxDistance}&interests=${interestsString}`;
};

export default function Filters() {
  const { setDiscover } = useDiscoverStore();
  const { filters, setFilters } = useFiltersStore();
  const { interests } = useInterestsStore();
  const { interestsList, setInterestsList } = useInterestsListStore();
  const [filterLimit, setFilterLimit] = useState<Filters>({
    interests: [],
    minAge: 18,
    maxAge: 100,
    minFameRating: 0,
    maxFameRating: 5000,
    maxDistance: 0,
  });

  const getDiscover = async () => {
    try {
      const res = await customAxios.get(
        `${getResultsLink(filters, interests)}`
      );
      setDiscover(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while fetching users' });
    }
  };

  const getFiltersInfos = async (isFirst = false) => {
    try {
      const { minAge, maxAge, minFameRating, maxFameRating, maxDistance } =
        filters;

      const res = await customAxios.get(
        `/user/filtersInfos?minAge=${minAge}&maxAge=${maxAge}&minFame=${minFameRating}&maxFame=${maxFameRating}&maxDistance=${maxDistance}`
      );
      setFilterLimit(res.data);
      setInterestsList(res.data.interests);

      if (isFirst) {
        setFilters(res.data);
      }
    } catch (err) {
      toast('Error', {
        description: 'An error occured while gettings filters',
      });
    }
  };

  useEffect(() => {
    getFiltersInfos(true);
    getDiscover();
  }, []);

  useEffect(() => {
    getDiscover();
  }, [interests]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-12 w-12 rounded-full">
          <Settings2Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xl mx-auto rounded-t-3xl">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-2xl text-black dark:text-white font-extrabold text-center">
            Filters
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4">
          <div className="flex justify-between items-center gap-5 border-b pb-2">
            <p className="text-lg font-bold text-black dark:text-white">
              Location
            </p>
            <Select
              onValueChange={(value) =>
                setFilters({ ...filters, maxDistance: parseInt(value) })
              }
              value={filters?.maxDistance?.toString()}
            >
              <SelectTrigger className="w-[180px] text-gray-400 font-bold border-0 text-md">
                <SelectValue placeholder="People nearby" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Location</SelectLabel>
                  <SelectItem value="0">People nearby</SelectItem>
                  <SelectItem value="10">10 km +</SelectItem>
                  <SelectItem value="50">50 km +</SelectItem>
                  <SelectItem value="100">100 km +</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-5 border-b pt-6 pb-8">
            <div className="flex justify-between">
              <p className="text-lg font-bold text-black dark:text-white">
                Age
              </p>
              <p className="text-pink">
                {filters.minAge} - {filters.maxAge}
              </p>
            </div>
            <Slider
              onValueChange={(value) =>
                setFilters({ ...filters, minAge: value[0], maxAge: value[1] })
              }
              value={[filters.minAge, filters.maxAge]}
              min={filterLimit.minAge}
              max={filterLimit.maxAge}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-5 border-b pt-6 pb-8">
            <div className="flex justify-between">
              <p className="text-lg font-bold text-black dark:text-white">
                Fame Rating
              </p>
              <p className="text-pink">
                {filters.minFameRating} - {filters.maxFameRating}
              </p>
            </div>
            <Slider
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  minFameRating: value[0],
                  maxFameRating: value[1],
                })
              }
              value={[filters.minFameRating, filters.maxFameRating]}
              min={filterLimit.minFameRating}
              max={filterLimit.maxFameRating}
              step={1}
            />
          </div>
        </div>
        <DrawerFooter className="flex-row">
          <DrawerClose>
            <Button variant="secondary" className="w-full h-12 text-md">
              Close
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                getDiscover();
                getFiltersInfos();
              }}
              className="w-full h-12 text-md"
            >
              Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
