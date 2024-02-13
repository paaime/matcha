import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FlagIcon, MoreHorizontalIcon, ShieldBanIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function More() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-10 bg-white/30 backdrop-blur-sm rounded-full border border-[#ffffff1a] hover:bg-white/40">
          <MoreHorizontalIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        {/* <DropdownMenuLabel>More actions</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <FlagIcon className="h-4 w-4 mr-2" />
          Report
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShieldBanIcon className="h-4 w-4 mr-2" />
          Block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
