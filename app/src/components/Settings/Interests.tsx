import { Interest } from '../Discover/Interests';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';

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

export default function Interests() {
  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Your interests</h3>
      <div className="flex flex-wrap gap-3 mx-auto">
        {fakeInterests.map((interest, index) => (
          <Interest key={index} value={interest} />
        ))}
      </div>
      <Button className="mt-10">Save</Button>
    </div>
  );
}
