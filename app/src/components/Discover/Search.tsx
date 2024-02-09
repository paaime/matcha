import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

export default function Search() {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg pl-5 pr-2 w-full mr-5">
      <SearchIcon />
      <Input
        type="search"
        placeholder="Search"
        className="bg-transparent border-0 text-md focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
