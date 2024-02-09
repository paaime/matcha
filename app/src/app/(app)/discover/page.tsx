import Header from '@/components/Discover/Header';
import Interests from '@/components/Discover/Interests';
import News from '@/components/Discover/News';
import Results from '@/components/Discover/Results';

export default function Page() {
  return (
    <div className="flex flex-col gap-7">
      <Header />
      <News />
      <Interests />
      <Results />
    </div>
  );
}
