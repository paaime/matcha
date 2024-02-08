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
    <div className="border border-gray-300 flex w-max rounded-full py-2 px-4 hover:bg-pink hover:text-white cursor-pointer">
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
      <div className="mt-3 grid grid-rows-2 grid-flow-col gap-4 overflow-scroll">
        {fakeInterests.map((interest, index) => (
          <Interest key={index} value={interest} />
        ))}
      </div>
    </div>
  );
}
