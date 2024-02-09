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

export default function Filters() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-12 w-12 rounded-full">
          <Settings2Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xl mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-2xl text-black font-extrabold text-center">
            Filters
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col p-4">
          <div className="flex justify-between gap-5 border-b py-6">
            <p className="text-xl font-bold text-black">Location</p>
            <Select>
              <SelectTrigger className="w-[180px] text-gray-400 font-bold">
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
              <p className="text-xl font-bold text-black">Age</p>
              <p className="text-pink">20-25</p>
            </div>
            <Slider defaultValue={[33, 50]} max={100} step={1} />
          </div>
          <div className="flex flex-col gap-5 border-b pt-6 pb-8">
            <div className="flex justify-between">
              <p className="text-xl font-bold text-black">Fame Rating</p>
              <p className="text-pink">20-25</p>
            </div>
            <Slider defaultValue={[33, 50]} max={100} step={1} />
          </div>
        </div>
        <DrawerFooter className="flex-row">
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full h-12">
              Reset
            </Button>
          </DrawerClose>
          <Button className="w-full h-12">Apply</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
