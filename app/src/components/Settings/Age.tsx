'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUserStore } from '@/store';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

export default function Age() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState<number>(user.age);

  const handleSubmit = async () => {
    try {
      if (age < 18 || age > 99 || isNaN(age))
        return toast.error('Please enter a valid age');
      setLoading(true);
      await customAxios.put('/user/age', {
        age,
      });
      setUser({ ...user, age });
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
      <h3 className="text-xl text-center font-extrabold mb-5">Age</h3>
      <Input
        type="number"
        className="mx-auto w-12 h-12 text-center text-lg font-semibold"
        placeholder="42"
        defaultValue={age}
        min={18}
        max={99}
        onChange={(e) => setAge(parseInt(e.target.value))}
      />
      <Button
        onClick={handleSubmit}
        isLoading={loading}
        className="mt-10 w-24 mx-auto"
      >
        Save
      </Button>
    </div>
  );
}
