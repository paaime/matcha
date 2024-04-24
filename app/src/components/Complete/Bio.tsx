import { CompleteForm } from '@/types/type';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function Bio({
  data,
  setData,
}: {
  data: CompleteForm;
  setData: Dispatch<SetStateAction<CompleteForm>>;
}) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (
      data.biography?.length < 10 ||
      data.biography?.length > 1000 ||
      !data.biography ||
      data.biography?.trim() === ''
    ) {
      return toast.error('Biography must be between 10 and 1000 characters.');
    }

    try {
      setLoading(true);
      await customAxios.post('/auth/complete', data);
      toast.success('Thank you for completing your profile!');
      push('/');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        defaultValue={data.biography}
        onChange={(e) =>
          setData((prev) => ({ ...prev, biography: e.target.value }))
        }
      />
      <Button
        className="mx-auto mt-10 w-52 dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleFinish}
        isLoading={loading}
      >
        Finish
      </Button>
    </div>
  );
}
