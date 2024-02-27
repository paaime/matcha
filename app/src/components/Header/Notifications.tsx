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
  const actualDate = new Date() as any;
  let date;
  let newDate;
  let time;

  if (notification.created_at) {
    date = new Date(notification.created_at.replace('Z', ''));
    newDate = Math.floor((actualDate - date) / 1000);
    time = Math.floor(newDate / 60);
    if (time < 60) {
      time = `${time}m ago`;
    } else if (time < 1440) {
      time = `${Math.floor(time / 60)}h ago`;
    } else {
      time = `${Math.floor(time / 1440)}d ago`;
    }
  } else {
    time = 'Just now';
  }

  return (
    <Link href={notification.redirect}>
      <p>{notification.content}</p>
      <p className="text-gray-500">{time}</p>
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
