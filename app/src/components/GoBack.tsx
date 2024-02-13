'use client';

import { ChevronLeftIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function GoBack({ white }: { white: boolean }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="bg-transparent w-10 h-10 group"
      onClick={() => router.back()}
    >
      <ChevronLeftIcon
        className={clsx(
          white ? 'text-white group-hover:text-black' : 'text-black',
          'h-6 w-6 '
        )}
      />
    </Button>
  );
}
