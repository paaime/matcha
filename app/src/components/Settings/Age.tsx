import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Age() {
  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl text-center font-extrabold mb-5">Age</h3>
      <Input
        type="number"
        className="mx-auto w-12 h-12 text-center text-lg font-semibold"
        placeholder="42"
      />
      <Button className="mt-10 w-24 mx-auto">Save</Button>
    </div>
  );
}
