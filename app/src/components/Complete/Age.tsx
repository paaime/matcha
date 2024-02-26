import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CompleteForm } from '@/types/type';
import { toast } from 'sonner';

export default function Age({
  setStep,
  data,
  setData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  data: CompleteForm;
  setData: Dispatch<SetStateAction<CompleteForm>>;
}) {
  const handleNext = () => {
    if (data.age < 18 || data.age > 99 || isNaN(data.age))
      return toast.error('Please enter a valid age.');
    setStep((prev) => prev + 1);
  };
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        What about your age ?
      </h3>
      <Input
        type="number"
        className="w-12 h-12 mx-auto text-center text-lg font-semibold"
        placeholder="42"
        defaultValue={data.age}
        min={18}
        max={99}
        onChange={(e) =>
          setData((prev) => ({ ...prev, age: parseInt(e.target.value) }))
        }
      />
      <Button className="mx-auto mt-10 w-52" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
