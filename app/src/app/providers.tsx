'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { updateCoords } from '@/utils/updateCoords';
import customAxios from '@/utils/axios';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {

  
  
  
  // useEffect(() => {
  //   const pathname = window.location.pathname;

  //   console.log('getPosition', pathname);

  //   if (pathname.includes('/auth')) return;

  //   updateCoords().then((coords: string) => {
  //     console.log(coords);

  //     customAxios.put('/user/location', {
  //       location: coords,
  //     })
  //   })
  // });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
