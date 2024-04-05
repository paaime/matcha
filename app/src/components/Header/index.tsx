import Link from 'next/link';
import NotificationsComp from './Notifications';
import Logo from '../icons/Logo';
import More from './More';

export default function Header() {
  return (
    <div className="flex justify-between mb-5">
      <Link href="/" className="flex items-center gap-1">
        <Logo height={25} />
        <h1 className="text-3xl font-extrabold">Matcha</h1>
      </Link>
      <div className="flex gap-4">
        <NotificationsComp />
        <More />
      </div>
    </div>
  );
}
