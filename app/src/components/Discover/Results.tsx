import ProfileCard from '../ProfileCard';
import { fakeUsers } from '@/fakeUsers';

export default function Results() {
  return (
    <div>
      <p className="text-xl text-black font-extrabold">
        Results <span className="text-pink">23</span>
      </p>
      <p className="text-gray-400">Some people you might like</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {fakeUsers.map((user, index) => {
          return <ProfileCard key={index} user={user} />;
        })}
      </div>
    </div>
  );
}
