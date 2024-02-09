const fakeInterests = [
  '🎵 Music',
  '🚀 Travel',
  '🍔 Food',
  '💙 Fashion',
  '💻 Technology',
  '🕹️ Gaming',
  '⚽️ Sports',
  '🎨 Art',
  '📸 Photography',
  '🏋️ Fitness',
  '📚 Reading',
  '🖊️ Writing',
];

const Interest = ({ value }: { value: string }) => {
  return (
    <div className="border border-gray-300 flex min-w-max rounded-full py-2 px-4 hover:bg-pink hover:text-white cursor-pointer">
      <p className="font-semibold">{value}</p>
    </div>
  );
};

export default function Interests() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <p className="text-xl text-black font-extrabold">Interest</p>
        <p className="text-pink hover:underline cursor-pointer">View all</p>
      </div>
      <div className="flex flex-col overflow-scroll">
        <div className="flex mt-3 gap-4">
          {fakeInterests.slice(0, 6).map((interest, index) => (
            <Interest key={index} value={interest} />
          ))}
        </div>
        <div className="flex mt-3 gap-4">
          {fakeInterests.slice(6, 12).map((interest, index) => (
            <Interest key={index} value={interest} />
          ))}
        </div>
      </div>
    </div>
  );
}
