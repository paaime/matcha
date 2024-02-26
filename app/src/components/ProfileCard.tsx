import { ILove } from '@/types/user';
import clsx from 'clsx';
import Link from 'next/link';

export default function ProfileCard({
  small = false,
  user,
}: {
  small?: boolean;
  user: ILove;
}) {
  const pictures = user.pictures?.split(',') || [];

  return (
    <Link
      href={`/profile/${user.id}`}
      className={clsx(
        !small && 'border-[5px] border-pink',
        user.isMatch && 'border-[5px] border-blue-500',
        small ? 'h-64 rounded-xl' : 'h-72 rounded-3xl',
        'block'
      )}
      style={{
        backgroundImage: `url(${pictures[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={clsx(
          small ? 'rounded-xl' : 'rounded-3xl',
          'flex flex-col justify-between items-center h-full'
        )}
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
          <div className={clsx(
            "bg-pink text-white font-bold px-5 pb-1 rounded-b-2xl text-sm",
            user.isMatch && "bg-blue-500"
          )}>
            <p>
              {user.isMatch
                ? "It's a match!"
                : user.compatibilityScore + "% Match" }
            </p>
          </div>
        )}
        <div className="flex flex-col items-center mb-3 mt-auto">
          {user.distance && user.distance > 0 ? (
            <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-1 px-3 text-white text-sm bg-white/30 font-semibold w-fit mb-1">
              <p>{user.distance} km away</p>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <p className="font-extrabold text-white text-xl">
              {user.firstName}, {user.age}
            </p>
            {user.isOnline ? (
              <div className="bg-green-300 h-1.5 w-1.5 rounded-full" />
            ) : null}
          </div>
          <p className="text-[#C0AFC0] font-semibold text-sm tracking-wider uppercase">
            {user.city}
          </p>
        </div>
      </div>
    </Link>
  );
}
