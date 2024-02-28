import { ILove, IUser } from '@/types/user';
import clsx from 'clsx';
import Link from 'next/link';

export default function ProfileCard({
  small = false,
  preview = false,
  user,
}: {
  small?: boolean;
  preview?: boolean;
  user: ILove;
}) {
  const pictures = user.pictures?.split(',') || [];
  const profilePicture = `${process.env.NEXT_PUBLIC_API}${pictures[0] ?? ''}`;

  return (
    <Link
      href={`/profile/${user.id}`}
      className={clsx(
        !small && 'border-[5px] border-pink',
        small || preview ? 'h-64 rounded-xl' : 'h-72 rounded-3xl',
        'block',
        user.isSuperLike && !user.isMatch && '!border-orange-500',
        user.isMatch && '!border-yellow-500'
      )}
      style={{
        backgroundImage: `url(${profilePicture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={clsx(
          small || preview ? 'rounded-xl' : 'rounded-3xl',
          'flex flex-col justify-between items-center h-full'
        )}
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 35%)',
        }}
      >
        {small ? (
          <div className="bg-primary dark:bg-blue-500 rounded-sm border border-pink px-3 py-1 self-start ml-3 mt-3">
            <p className="text-white font-semibold text-sm">NEW</p>
          </div>
        ) : (
          !preview && (
            <div
              className={clsx(
                'bg-pink text-white font-bold px-5 pb-1 rounded-b-2xl text-sm',
                user.isSuperLike && !user.isMatch && '!bg-orange-500',
                user.isMatch && '!bg-yellow-500'
              )}
            >
              <p>
                {user.isSuperLike && '⭐️ '}
                {user.isMatch
                  ? "It's a match!"
                  : user.compatibilityScore + '% Match'}
              </p>
            </div>
          )
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
