'use client';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useFiltersStore } from '@/store';

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

export const StaticInterest = ({ value }: { value: string }) => {
  return (
    <Label className="border border-gray-300 flex min-w-max rounded-full py-2 px-4">
      <Checkbox className="sr-only" value={value} />
      <p className="font-semibold text-primary text-base">{value}</p>
    </Label>
  );
};

export const OnlineInterests = () => {
  const { filters } = useFiltersStore();

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <p className="text-xl text-black font-extrabold">Interest</p>
        <p className="text-pink hover:underline cursor-pointer">
          {filters?.interests?.length} interests
        </p>
      </div>

      <div className="flex flex-col overflow-scroll relative">
        <div className="flex mt-3 gap-4">
          {filters?.interests?.slice(0, 5).map((interest, index) => (
            <Interest
              key={index}
              value={interest}
              changeInterests={null}
              checked={false}
            />
          ))}
        </div>

        <div className="flex mt-3 gap-4">
          {filters?.interests?.slice(5, 10).map((interest, index) => (
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
};
