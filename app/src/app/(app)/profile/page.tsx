import { Button } from '@/components/ui/button';
import { HeartIcon, NavigationIcon } from 'lucide-react';
import More from '@/components/Profile/More';
import Informations from '@/components/Profile/Informations';
import { fakeUsers } from '@/fakeUsers';
import GoBack from '@/components/GoBack';
import Gallery from '@/components/Profile/Gallery';
import { IProfile } from '@/types/profile';

export default function Page() {
  const user: IProfile = fakeUsers[0];
  return (
    <>
      <div
        className="sm:rounded-3xl -mx-7 sm:mx-auto relative"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 'calc(70vh - 50px)',
          minHeight: '250px',
        }}
      >
        <Gallery />
        <div
          className="flex flex-col justify-between p-5 h-full love-card rounded-3xl relative pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgb(5 20 90 / 84%) 0%, transparent 40%)',
          }}
        >
          <div className="flex justify-between items-start pointer-events-auto">
            <GoBack white={true} />
            <div className="flex gap-3">
              <div className="flex gap-2 items-center border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
                <NavigationIcon className="h-4 w-4" />
                <p>{user.distance} km</p>
              </div>
              <More />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 pb-10">
            <Button className="h-12 w-12 mb-1 rounded-full bg-pink shadow-xl text-white group pointer-events-auto">
              <HeartIcon className="group-hover:fill-white" />
            </Button>
            <p className="font-extrabold text-white text-3xl">
              {user.name}, {user.age}
            </p>
            <p className="text-[#C0AFC0] font-semibold tracking-wider uppercase">
              {user.location}
            </p>
          </div>
        </div>
      </div>
      <Informations user={user} />
    </>
  );
}
