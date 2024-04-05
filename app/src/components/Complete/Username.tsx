/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CompleteForm } from '@/types/type';
import { toast } from 'sonner';

export default function Username({
  setStep,
  data,
  setData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  data: CompleteForm;
  setData: Dispatch<SetStateAction<CompleteForm>>;
}) {
  useEffect(() => {
    // get username from params
    const username = new URLSearchParams(window.location.search).get(
      'username'
    );

    // Check if username is valid
    const isValid = /^[a-z]{3,40}$/.test(username);

    // Update data
    if (isValid && !data.username) setData((prev) => ({ ...prev, username }));
  }, []);

  const handleNext = () => {
    if (!/^[a-z]{3,40}$/.test(data.username) || !data.username)
      return toast.error(
        'Please enter a valid username (3-40 lowercase letters).'
      );
    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        Choose a username
      </h3>
      <Input
        type="text"
        className="w-50 h-12 mx-auto text-center text-lg font-semibold"
        placeholder="wil"
        defaultValue={data.username}
        minLength={3}
        maxLength={40}
        onChange={(e) =>
          setData((prev) => ({ ...prev, username: e.target.value?.trim() }))
        }
      />
      <Button
        className="mx-auto mt-10 w-52 dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleNext}
      >
        Continue
      </Button>
    </div>
  );
}
