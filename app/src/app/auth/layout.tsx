'use client';

import Logo from '@/components/icons/Logo';
import customAxios from '@/utils/axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    try {
      const response = await customAxios.get('/user/me');
      if (response.data.isComplete) {
        push('/');
        return;
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="min-h-screen container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-[#FDF7FD]">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink" />
        </div>
      ) : (
        <>
          <div className="relative hidden h-full flex-col items-center justify-center bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-pink" />
            <div className="relative z-20 flex flex-col items-center text-lg font-medium">
              <div className="flex items-center">
                <Logo white height={40} />
                <h1 className="font-extrabold text-5xl ml-3">Matcha</h1>
              </div>
              <p className="text-lg font-normal ml-3">Find your soulmate</p>
            </div>
            <Image
              src="/img/background.png"
              width={300}
              height={300}
              alt="Background"
              className="absolute right-0 z-10 top-[20%] w-auto"
              priority
            />
          </div>
          <div className="py-5 p-8 h-full w-screen lg:w-auto">{children}</div>
        </>
      )}
    </div>
  );
}
