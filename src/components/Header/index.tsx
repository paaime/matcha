import { BellIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex justify-between mb-5">
      <Link href="/home" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <h1 className="text-3xl font-extrabold">Matcha</h1>
      </Link>
      <Button variant="outline" className="rounded-full h-10 w-10">
        <BellIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
