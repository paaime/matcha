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

export default function Filters() {
  const [results, setResults] = useState<Filters>({
    interests: [],
    minAge: 18,
    maxAge: 100,
    minFameRating: 0,
    maxFameRating: 500,
  });

  const getInterests = async () => {
    try {
      const res = await customAxios.get('/user/filtersInfos');
      setResults(res.data);
    } catch (err) {
      toast('Error', { description: 'An error occured while gettings filters' });
    }
  };

  useEffect(() => {
    getInterests();
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-12 w-12 rounded-full">
          <Settings2Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xl mx-auto rounded-t-3xl">
        <DrawerHeader className="pb-0">
          <DrawerTitle className="text-2xl text-black font-extrabold text-center">
            Filters
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4">
          <div className="flex justify-between items-center gap-5 border-b pb-2">
            <p className="text-lg font-bold text-black">Location</p>
            <Select>
              <SelectTrigger className="w-[180px] text-gray-400 font-bold border-0 text-md">
                <SelectValue placeholder="People nearby" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Location</SelectLabel>
                  <SelectItem value="apple">People nearby</SelectItem>
                  <SelectItem value="banana">10 km +</SelectItem>
                  <SelectItem value="blueberry">20 km +</SelectItem>
                  <SelectItem value="grapes">50 km +</SelectItem>
                  <SelectItem value="pineapple">100 km +</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-5 border-b pt-6 pb-8">
            <div className="flex justify-between">
              <p className="text-lg font-bold text-black">Age</p>
              <p className="text-pink">
                {results.minAge} - {results.maxAge}
              </p>
            </div>
            <Slider
              defaultValue={[results.minAge,results.maxAge]}
              min={results.minAge}
              max={results.maxAge}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-5 border-b pt-6 pb-8">
            <div className="flex justify-between">
              <p className="text-lg font-bold text-black">Fame Rating</p>
              <p className="text-pink">
                {results.minFameRating} - {results.maxFameRating}
              </p>
            </div>
            <Slider
              defaultValue={[results.minFameRating, results.maxFameRating]}
              min={results.minFameRating}
              max={results.maxFameRating}
              step={1}
            />
          </div>
        </div>
        <DrawerFooter className="flex-row">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full h-12 text-md">
              Reset
            </Button>
          </DrawerClose>
          <Button className="w-full h-12 text-md">Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
