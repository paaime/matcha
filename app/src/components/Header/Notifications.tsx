import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { BellIcon } from 'lucide-react';

const Notification = () => {
  return (
    <div>
      <p>You have a match !</p>
      <p className="text-gray-500">5 min ago</p>
    </div>
  );
};

export default function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full h-10 w-10">
          <BellIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Notification />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Notification />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Notification />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
