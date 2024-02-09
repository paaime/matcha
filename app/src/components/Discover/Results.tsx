import ProfileCard from '../ProfileCard';

export default function Results() {
  return (
    <div>
      <p className="text-xl text-black font-extrabold">
        Results <span className="text-pink">23</span>
      </p>
      <p className="text-gray-400">Some people you might like</p>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
      </div>
    </div>
  );
}
