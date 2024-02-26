'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

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

export const Interest = ({
  value,
  changeInterests,
  checked,
}: {
  value: string;
  changeInterests: any;
  checked: boolean;
}) => {
  return (
    <Label className="[&:has([data-state=checked])]:bg-pink border [&:has([data-state=checked])>p]:text-white border-gray-300 flex min-w-max rounded-full py-2 px-4 hover:bg-pink cursor-pointer group transition-all">
      <Checkbox
        className="sr-only"
        value={value}
        onCheckedChange={(checked) => {
          changeInterests(value, checked);
        }}
        defaultChecked={checked}
      />
      <p className="font-semibold text-primary text-base group-hover:text-white">
        {value}
      </p>
    </Label>
  );
};

export default function Interests() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <p className="text-xl text-black font-extrabold">Interest</p>
        <p className="text-pink hover:underline cursor-pointer">View all</p>
      </div>
      <div className="flex flex-col overflow-scroll relative">
        <div className="flex mt-3 gap-4">
          {fakeInterests.slice(0, 6).map((interest, index) => (
            <Interest
              key={index}
              value={interest}
              changeInterests={null}
              checked={false}
            />
          ))}
        </div>
        <div className="flex mt-3 gap-4">
          {fakeInterests.slice(6, 12).map((interest, index) => (
            <Interest
              key={index}
              value={interest}
              changeInterests={null}
              checked={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
