import Filters from '@/components/Discover/Filters';
import Interests from '@/components/Discover/Interests';
import Results from '@/components/Discover/Results';
import { Button } from '@/components/ui/button';
import { MapPinIcon, SearchIcon, Settings2Icon } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <MapPinIcon className="h-4 w-4 stroke-pink" />
            <span className="text-sm font-semibold">Lyon</span>
          </div>
          <h2 className="text-2xl font-extrabold text-black">Discover</h2>
        </div>
        <div className="flex gap-3 items-center">
          <Button variant="outline" className="h-12 w-12 rounded-full">
            <SearchIcon />
          </Button>
          <Filters />
        </div>
      </div>
      <Interests />
      <Results />
    </div>
  );
}
