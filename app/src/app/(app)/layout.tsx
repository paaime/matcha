'use client';

import Header from '@/components/Header';
import Menu from '@/components/Menu';
import { useEffect, useState } from 'react';
import customAxios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useSocketStore, useUserStore } from '@/store';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { connect } = useSocketStore();
  const [loading, setLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const { push } = useRouter();

  const getUser = async () => {
    try {
      const response = await customAxios.get('/user/me');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      push('/auth/sign-in');
    }
  };

  useEffect(() => {
    getUser();
    connect();
  }, []);

  return (
    <div className="bg-[#FDF7FD] min-h-screen ">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink" />
        </div>
      ) : (
        <>
          <main className="max-w-screen-sm mx-auto p-5 pb-28">
            <Header />
            {children}
          </main>
          <Menu />
        </>
      )}
    </div>
  );
}
