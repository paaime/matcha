import { CompleteForm } from '@/types/type';
import { Interest } from '../Discover/Interests';
import { Button } from '../ui/button';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { interestsList } from '@/types/list';

export default function Interests({
  setStep,
  data,
  setData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  data: CompleteForm;
  setData: Dispatch<SetStateAction<CompleteForm>>;
}) {
  const handleNext = () => {
    if (data.interests.length < 2) {
      return toast.error('Please select at least 2 interests.');
    } else if (data.interests.length > 5) {
      return toast.error('You can only select up to 5 interests.');
    }
    setStep((prev) => prev + 1);
  };
  const changeInterests = (value: string, checked: boolean) => {
    if (checked) {
      setData((prev) => ({ ...prev, interests: [...prev.interests, value] }));
    } else {
      setData((prev) => ({
        ...prev,
        interests: prev.interests.filter((interest) => interest !== value),
      }));
    }
  };
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        Select up to 5 interests
      </h3>
      <div className="flex flex-wrap gap-3 mx-auto justify-center max-w-[360px]">
        {interestsList.map((interest, index) => (
          <Interest
            key={index}
            value={interest}
            changeInterests={changeInterests}
            checked={data.interests.includes(interest)}
          />
        ))}
      </div>
      <Button className="mx-auto mt-10 w-52 dark:bg-background dark:text-white dark:border dark:border-input" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
