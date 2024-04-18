/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useChatsStore, useSocketStore } from '@/store';
import { IPreviewChat } from '@/types/chat';
import customAxios from '@/utils/axios';
import { timeSince } from '@/utils/time';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Chat = ({ chat }: { chat: IPreviewChat }) => {
  const pictures = chat.pictures?.split(',') || [];
  return (
    <Link
      href={`/chat/${chat.id}`}
      className="borber border-b flex py-5 cursor-pointer"
    >
      <Image
        loader={({ src }) => src}
        src={`${
          pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API
        }${pictures[0]}`}
        alt={chat.username}
        width={200}
        height={300}
        className="rounded-full w-14 h-14 object-cover mr-5"
        priority
        unoptimized
      />
      <div className="max-w-[50%] flex flex-col text-dark dark:text-white justify-center">
        <div className="flex items-center justify-start">
          {chat.isOnline ? (
            <div className="bg-green-300 h-2.5 w-2.5 rounded-full mr-3" />
          ) : null}
          <p className="text-lg font-bold">{chat.firstName}</p>
        </div>
        <p className=" truncate">{chat.lastMessage ?? 'No messages'}</p>
      </div>

      {chat.lastMessage ? (
        <div className="flex flex-col items-end ml-auto">
          <div className="bg-pink h-3 w-3 rounded-full"></div>
          <p className="text-sm text-gray-400 font-semibold mt-auto">
            {timeSince(chat.lastMessageDate.replace('Z', ''))}
          </p>
        </div>
      ) : null}
    </Link>
  );
};

export default function Chats() {
  const { socket } = useSocketStore();
  const { chats, setChats } = useChatsStore();
  const [sortedChats, setSortedChats] = useState<IPreviewChat[]>([]);

  const getChats = async () => {
    try {
      const { data } = await customAxios.get('/chat');

      const sortedChats = [...data].sort((a, b) => {
        const dateA = new Date(a.lastMessageDate).getTime();
        const dateB = new Date(b.lastMessageDate).getTime();
        return dateB - dateA; // Sort in descending order
      });

      setChats(sortedChats);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (body) => {
        let message = JSON.parse(body);
        // check if in the chats there is a chat with id === to match_id
        const chat = chats.find((c) => c.id === message.match_id);
        if (chat) {
          let newChats = chats.map((c) => {
            if (c.id === chat.id) {
              return {
                ...c,
                lastMessage: message.content,
                lastMessageDate: message.created_at,
              };
            }
            return c;
          });

          const sortedChats = [...newChats].sort((a, b) => {
            const dateA = new Date(a.lastMessageDate).getTime();
            const dateB = new Date(b.lastMessageDate).getTime();
            return dateB - dateA; // Sort in descending order
          });

          setChats(sortedChats);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  return (
    <div
      className="-mx-4 md:mx-auto -mb-28 bg-white dark:bg-gray-950 dark:border dark:border-input flex flex-col rounded-t-3xl px-7 pb-32 overflow-scroll"
      style={{
        height: 'calc(100vh - 250px)',
      }}
    >
      {chats.map((chat, index) => (
        <Chat chat={chat} key={index} />
      ))}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-400">No chats</p>
        </div>
      )}
    </div>
  );
}
