'use client';

import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai';
import { LiaTransgenderSolid } from 'react-icons/lia';
import { Button } from '../ui/button';
import { useUserStore } from '@/store';
import { toast } from 'sonner';
import { useState } from 'react';
import { Gender} from '@/types/type';
import customAxios from '@/utils/axios';

export default function Gender() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [gender, setGender] = useState<Gender>(user.gender as Gender);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await customAxios.put('/user/gender', { gender });
      setUser({ ...user, gender });
      toast.success('Updated');
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message, {
          description: 'Error',
        });
      } else
        toast.error('An error occurred', {
          description: 'Error',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Your gender</h3>
      <div>
        <RadioGroup
          className="flex flex-wrap gap-5 pt-2"
          id="gender"
          defaultValue={user.gender}
          onValueChange={(value: Gender) => setGender(value)}
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
        isLoading={loading}
        onClick={handleSubmit}
        className="mt-10 dark:bg-background dark:text-white dark:border dark:border-input"
      >
        Save
      </Button>
    </div>
  );
}
