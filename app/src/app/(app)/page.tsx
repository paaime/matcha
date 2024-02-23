import AvatarCarousel from '@/components/Home/AvatarCarousel';
import LoveCarousel from '@/components/Home/LoveCarousel';

export default async function Page() {
  return (
    <div className="flex flex-col gap-7">
      {/* <AvatarCarousel /> */}
      <LoveCarousel />
    </div>
  );
}
