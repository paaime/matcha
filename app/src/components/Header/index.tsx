import Link from 'next/link';
import Notifications from './Notifications';
import Logo from '../icons/Logo';
import Logout from './Logout';

export default function Header() {
  return (
    <div className="flex justify-between mb-5">
      <Link href="/" className="flex items-center gap-1">
        <Logo height={25} />
        <h1 className="text-3xl font-extrabold">Matcha</h1>
      </Link>
      <div className='flex gap-4'>
        <Notifications />
        <Logout />
      </div>
    </div>
  );
}
