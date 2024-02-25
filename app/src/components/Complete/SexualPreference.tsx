import 'animate.css';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai';
import { LiaTransgenderSolid } from 'react-icons/lia';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';

export default function SexualPreference({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        What is your sexual preference ?
      </h3>
      <div>
        <RadioGroup
          className="flex flex-wrap justify-center gap-5 pt-2"
          id="sexual-preference"
        >
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="heterosexual" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary rounded-full">
              <AiOutlineMan className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Heterosexual
            </span>
          </Label>
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="homosexual" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-pink rounded-full">
              <AiOutlineWoman className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Homosexual
            </span>
          </Label>
          <Label className="bg-white flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="Bisexual" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary/80 rounded-full">
              <LiaTransgenderSolid className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Bisexual
            </span>
          </Label>
        </RadioGroup>
      </div>
      <Button
        className="mx-auto mt-10 w-52"
        onClick={() => setStep((prev) => prev + 1)}
      >
        Continue
      </Button>
    </div>
  );
}