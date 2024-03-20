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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';

const NotificationItem = ({ notification }: { notification: Notification }) => {
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
      {notification.isRead === false && (
        <div className="bg-blue-500 w-2 h-2 rounded-full absolute right-2 top-2"></div>
      )}

      <p>{notification.content}</p>
      <p className="text-gray-500">{time}</p>
    </Link>
  );
};

export default function NotificationsComp() {
  const [hasUnread, setHasUnread] = useState(false);

  const socket = useSocketStore((state) => state.socket);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const notifCount = () => {
    let count = user?.notifications?.filter((n) => !n.isRead)?.length || 0;

    return count > 99 ? '99+' : count;
  }

  const markAsRead = async (open: boolean = false) => {
    if (open) return;
    try {
      await customAxios.put('/user/notifications');
      setUser({ ...user, notifications: user?.notifications?.map((n) => ({ ...n, isRead: true })) });
    } catch (error) {
      toast('An error occurred while updating the status of the notification. Please try again.');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('notification', (body) => {
        let notification: Notification = JSON.parse(body);

        // Mark incoming notification as read
        notification.isRead = true;

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

  useEffect(() => {
    const hasUnread = user?.notifications?.some((n) => !n.isRead);

    setHasUnread(hasUnread);

    if (hasUnread) {
      document.title = `(${user?.notifications?.length}) Matcha`;
    } else {
      document.title = 'Matcha';
    }

  }, [user?.notifications]);

  return (
    <DropdownMenu onOpenChange={markAsRead}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full h-10 w-10 relative">
          <BellIcon className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1">
              {notifCount()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuLabel>
          Notifications

          {hasUnread && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full">
              {user?.notifications?.filter((n) => !n.isRead).length}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div
          className="flex flex-col overflow-scroll"
          style={{
            maxHeight: '300px',
          }}
        >
          {user?.notifications?.map((notification, index) => (
            <DropdownMenuItem key={index}>
              <NotificationItem notification={notification} />
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
