import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FlagIcon, MoreHorizontalIcon, ShieldBanIcon } from 'lucide-react';
import { Button } from '../ui/button';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

type Props = {
  user_id: number;
  isBlocked: boolean;
};

export default function More ({ user_id, isBlocked }: Props) {
  const blockUser = async () => {
    try {
      if (isBlocked) {
        await customAxios.post(`/user/unblock/${user_id}`);
      } else {
        await customAxios.post(`/user/block/${user_id}`);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else
        toast('An error occured', {
          description: 'Error',
        });
    }
  };

  const reportUser = async () => {
    try {
      await customAxios.post(`/user/report/${user_id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else
        toast('An error occured', {
          description: 'Error',
        });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-10 w-10 bg-white/30 backdrop-blur-sm rounded-full border border-[#ffffff1a] hover:bg-white/40">
          <MoreHorizontalIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem onClick={reportUser}>
          <FlagIcon className="h-4 w-4 mr-2" />
          Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={blockUser}>
          <ShieldBanIcon className="h-4 w-4 mr-2" />
          {isBlocked ? 'Unblock' : 'Block'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
