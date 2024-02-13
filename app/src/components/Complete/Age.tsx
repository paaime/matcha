import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Age({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        What about your age ?
      </h3>
      <Input
        type="number"
        className="w-12 h-12 mx-auto text-center text-lg font-semibold"
        placeholder="42"
      />
      <Button
        className="mx-auto mt-10 w-52"
        onClick={() => setStep((prev) => prev + 1)}
      >
        Continue
      </Button>
    </div>
  );
}
