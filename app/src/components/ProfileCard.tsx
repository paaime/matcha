import { IProfile } from '@/types/profile';
import clsx from 'clsx';
import Link from 'next/link';

export default function ProfileCard({
  small = false,
  user,
}: {
  small?: boolean;
  user: IProfile;
}) {
  return (
    <Link
      href="/profile"
      className={clsx(
        !small && 'border-[5px] border-pink',
        small ? 'h-64 rounded-xl' : 'h-72 rounded-3xl',
        'block'
      )}
      style={{
        backgroundImage: `url(${user.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="flex flex-col justify-between items-center h-full rounded-3xl"
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 35%)',
        }}
      >
        {small ? (
          <div className="bg-primary rounded-sm border border-pink px-3 py-1 self-start ml-3 mt-3">
            <p className="text-white font-semibold text-sm">NEW</p>
          </div>
        ) : (
          <div className="bg-pink text-white font-bold px-5 pb-1 rounded-b-2xl text-sm">
            <p>100% Match</p>
          </div>
        )}
        <div className="flex flex-col items-center mb-3 mt-auto">
          <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-1 px-3 text-white text-sm bg-white/30 font-semibold w-fit mb-1">
            <p>{user.distance} km away</p>
          </div>
          <p className="font-extrabold text-white text-xl">
            {user.name}, {user.age}
          </p>
          <p className="text-[#C0AFC0] font-semibold text-sm tracking-wider uppercase">
            {user.location}
          </p>
        </div>
      </div>
    </Link>
  );
}
