'use client';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

export default function Bio() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [bio, setBio] = useState<string>(user.biography);

  const handleSubmit = async () => {
    if (bio?.length < 10 || bio?.length > 1000 || !bio) {
      return toast.error('Biography must be between 10 and 1000 characters.');
    }
    try {
      setLoading(true);
      await customAxios.put('/user/bio', {
        bio,
      });
      setUser({ ...user, biography: bio });
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
      <h3 className="text-xl font-extrabold mb-5">
        Tell us more about yourself
      </h3>
      <Textarea
        rows={4}
        className="w-full mx-auto resize-none rounded-2xl"
        placeholder="Write your bio..."
        defaultValue={bio}
        onChange={(e) => setBio((e.target as HTMLTextAreaElement).value)}
      />
      <Button
        isLoading={loading}
        className="mx-auto mt-10 w-full dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleSubmit}
      >
        Save
      </Button>
    </div>
  );
}
