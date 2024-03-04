import type { Metadata } from 'next';
import '../styles/globals.scss';
import { Providers } from './providers';
import clsx from 'clsx';
import { Toaster } from '@/components/ui/sonner';
import localFont from 'next/font/local';
import 'animate.css';

const hellix = localFont({
  src: [
    {
      path: '../../public/fonts/Hellix/Hellix-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Hellix/Hellix-Medium.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Hellix/Hellix-SemiBold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Hellix/Hellix-Bold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Hellix/Hellix-ExtraBold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={clsx(hellix.className, 'antialiased')}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}