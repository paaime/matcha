import CompleteForm from '@/components/Complete/Form';

export const metadata = {
  title: 'Matcha | Complete your profile',
};

export default async function Complete() {
  return (
    <div className="mx-auto flex w-full flex-col space-y-6 h-full justify-between">
      <CompleteForm />
    </div>
  );
}
