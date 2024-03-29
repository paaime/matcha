'use client';

import { useTheme } from 'next-themes';

export default function Logo({
  white = false,
  height,
}: {
  white?: boolean;
  height?: number;
}) {
  const { resolvedTheme } = useTheme();
  resolvedTheme === 'dark' ? (white = true) : (white = false);
  return (
    <svg
      width="36"
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.9999 17.1111C34.0061 19.4576 33.4579 21.7723 32.4 23.8667C31.1456 26.3764 29.2173 28.4874 26.831 29.9632C24.4447 31.4389 21.6946 32.2211 18.8889 32.2222C16.5424 32.2283 14.2277 31.6801 12.1333 30.6222L2 34L5.37777 23.8667C4.31987 21.7723 3.77166 19.4576 3.77777 17.1111C3.77886 14.3054 4.56108 11.5553 6.03683 9.16902C7.51257 6.78271 9.62355 4.85439 12.1333 3.60005C14.2277 2.54215 16.5424 1.99393 18.8889 2.00005H19.7778C23.4832 2.20448 26.9831 3.76851 29.6073 6.39268C32.2315 9.01685 33.7955 12.5167 33.9999 16.2222V17.1111Z"
        fill="none"
        stroke={white ? 'white' : '#4a164b'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 18C27 20.1217 26.1571 22.1566 24.6569 23.6569C23.1566 25.1571 21.1217 26 19 26C16.8783 26 14.8434 25.1571 13.3431 23.6569C11.8429 22.1566 11 20.1217 11 18L19 18H27Z"
        fill={white ? 'white' : '#4a164b'}
      />
      <circle cx="25" cy="12" r="2" fill={white ? 'white' : '#4a164b'} />
      <circle cx="19" cy="12" r="2" fill={white ? 'white' : '#4a164b'} />
      <circle cx="13" cy="12" r="2" fill={white ? 'white' : '#4a164b'} />
    </svg>
  );
}
