import { BellIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Notifications from './Notifications';
import Logo from '../icons/Logo';

export default function Header() {
  return (
    <div className="flex justify-between mb-5">
      <Link href="/" className="flex items-center gap-1">
        <Logo height={25} />
        <h1 className="text-3xl font-extrabold">Matcha</h1>
      </Link>
      <Notifications />
    </div>
  );
}
