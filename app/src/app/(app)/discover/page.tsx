import Header from '@/components/Discover/Header';
import { OnlineInterests } from '@/components/Discover/Interests';
import News from '@/components/Discover/News';
import Results from '@/components/Discover/Results';

export const metadata = {
  title: 'Matcha | Discover',
};

export default function Page() {
  return (
    <div className="flex flex-col gap-7">
      <Header />
      <News />
      <OnlineInterests />
      <Results />
    </div>
  );
}
