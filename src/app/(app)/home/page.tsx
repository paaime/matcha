import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvatarCarousel from '@/components/Home/AvatarCarousel';
import LoveCarousel from '@/components/Home/LoveCarousel';

export default function Page() {
  return (
    <div className="flex flex-col gap-7">
      <AvatarCarousel />
      <LoveCarousel />
    </div>
  );
}
