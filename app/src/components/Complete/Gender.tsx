import 'animate.css';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai';
import { LiaTransgenderSolid } from 'react-icons/lia';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';
import { CompleteForm, Gender } from '@/types/type';
import { toast } from 'sonner';

export default function GenderComp({
  setStep,
  data,
  setData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  data: CompleteForm;
  setData: Dispatch<SetStateAction<CompleteForm>>;
}) {
  const handleNext = () => {
    if (!['male', 'female', 'other'].includes(data.gender)) {
      return toast.error('Please select a gender.');
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        What is your gender ?
      </h3>
      <div>
        <RadioGroup
          className="flex flex-wrap justify-center gap-5 pt-2"
          id="gender"
          onValueChange={(value: Gender) =>
            setData((prev) => ({ ...prev, gender: value }))
          }
          defaultValue={data.gender}
        >
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="male" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary dark:bg-blue-500 rounded-full">
              <AiOutlineMan className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Man
            </span>
          </Label>
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="female" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-pink rounded-full">
              <AiOutlineWoman className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Woman
            </span>
          </Label>
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 items-center w-36 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl py-5 cursor-pointer">
            <RadioGroupItem value="other" className="sr-only" />
            <div className="flex items-center justify-center h-12 w-12 bg-primary/80 rounded-full">
              <LiaTransgenderSolid className="h-6 w-6 text-white" />
            </div>
            <span className="text-center text-base w-full font-semibold">
              Other
            </span>
          </Label>
        </RadioGroup>
      </div>
      <Button
        className="mx-auto mt-10 w-52 dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleNext}
      >
        Continue
      </Button>
    </div>
  );
}
