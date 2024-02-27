'use client';

import { useUserStore } from '@/store';
import { Interest } from '../Discover/Interests';
import { Button } from '../ui/button';
import { useState } from 'react';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';
import { interestsList } from '@/types/list';

export default function Interests() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [interests, setInterests] = useState<string[]>(user.interests);

  const changeInterests = (interest: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interest]);
    } else {
      setInterests(interests.filter((i) => i !== interest));
    }
  };

  const handleSubmit = async () => {
    try {
      if (interests.length < 2) {
        return toast.error('Please select at least 2 interests.');
      } else if (interests.length > 5) {
        return toast.error('You can only select up to 5 interests.');
      }
      setLoading(true);
      await customAxios.put('/user/interests', {
        interests,
      });
      setUser({ ...user, interests });
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
      <h3 className="text-xl font-extrabold mb-5">Your interests</h3>
      <div className="flex flex-wrap gap-3 mx-auto">
        {interestsList.map((interest, index) => (
          <Interest
            key={index}
            value={interest}
            checked={interests.includes(interest)}
            changeInterests={changeInterests}
          />
        ))}
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
