import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dispatch, SetStateAction } from 'react';

export default function Bio({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-1">
        Tell us more about yourself
      </h3>
      <p className="text-center mb-5 text-gray-600">
        That&apos;s the last step, we promise!
      </p>
      <Textarea
        rows={4}
        className=" max-w-72 mx-auto resize-none rounded-2xl"
        placeholder="Write your bio..."
      />
      <Button className="mx-auto mt-10 w-52">Finish</Button>
    </div>
  );
}
