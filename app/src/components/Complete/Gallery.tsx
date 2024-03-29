'use client';

import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';
import { useUserStore } from '@/store';
import { GalleryImage } from '../Settings/Gallery';
import { toast } from 'sonner';

export default function Gallery({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const { user } = useUserStore();
  const pictures = user?.pictures?.split(',');

  const handleNext = () => {
    if (pictures?.length < 1 || !pictures) {
      return toast.error('Please upload at least one photo.');
    }
    setStep((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        Upload your photos
      </h3>
      <div className="photo-gallery-complete mx-auto w-full h-96">
        <GalleryImage id={1} picture={pictures?.[0]} />
        <GalleryImage id={2} picture={pictures?.[1]} />
        <GalleryImage id={3} picture={pictures?.[2]} />
        <GalleryImage id={4} picture={pictures?.[3]} />
        <GalleryImage id={5} picture={pictures?.[4]} />
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
