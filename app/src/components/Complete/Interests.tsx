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

export default function Interests({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        Select up to 5 interests
      </h3>
      <div className="flex flex-wrap gap-3 mx-auto justify-center max-w-[360px]">
        {fakeInterests.map((interest, index) => (
          <Interest key={index} value={interest} />
        ))}
      </div>
      <Button
        className="mx-auto mt-10 w-52"
        onClick={() => setStep((prev) => prev + 1)}
      >
        Continue
      </Button>
    </div>
  );
}
