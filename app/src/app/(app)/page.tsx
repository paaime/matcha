import LoveCarousel from '@/components/Home/LoveCarousel';

export const metadata = {
  title: 'Matcha | Find your love',
};

export default async function Page() {
  return (
    <div className="flex flex-col gap-7">
      <LoveCarousel />
    </div>
  );
}
