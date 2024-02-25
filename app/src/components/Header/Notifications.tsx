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
import { useSocketStore, useUserStore } from '@/store';
import { Notification } from '@/types/type';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Notification = ({ notification }: { notification: Notification }) => {
  return (
    <Link href={notification.redirect}>
      <p>{notification.content}</p>
      <p className="text-gray-500">5 min ago</p>
    </Link>
  );
};

export default function Notifications() {
  const socket = useSocketStore((state) => state.socket);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (body) => {
        let notification: Notification = JSON.parse(body);
        let newUser = {
          ...user,
          notifications: [notification, ...user.notifications],
        };
        setUser(newUser);
        toast(notification.content, {
          description: 'Just now',
        });
      });
    }
  }, [socket]);

  useEffect(() => {});
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
        <div
          className="flex flex-col overflow-scroll"
          style={{
            maxHeight: '300px',
          }}
        >
          {user?.notifications?.map((notification, index) => (
            <DropdownMenuItem key={index}>
              <Notification notification={notification} />
            </DropdownMenuItem>
          ))}
        </div>
        {user?.notifications?.length === 0 && (
          <DropdownMenuItem>
            <p>No notifications</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
