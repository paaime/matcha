import 'animate.css';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai';
import { LiaTransgenderSolid } from 'react-icons/lia';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';

export default function Gender() {
  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Your gender</h3>
      <div>
        <RadioGroup className="flex flex-wrap gap-5 pt-2" id="gender">
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="man" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary rounded-full">
              <AiOutlineMan className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Man
            </span>
          </Label>
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="women" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-pink rounded-full">
              <AiOutlineWoman className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Woman
            </span>
          </Label>
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="transgender" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary/80 rounded-full">
              <LiaTransgenderSolid className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Transgender
            </span>
          </Label>
        </RadioGroup>
      </div>
      <Button className="mt-10">Save</Button>
    </div>
  );
}
