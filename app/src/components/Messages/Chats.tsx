'use client';

import { useChatsStore, useSocketStore } from '@/store';
import customAxios from '@/utils/axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Chat = () => {
  return (
    <Link href="/chat" className="borber border-b flex py-5 cursor-pointer">
      <Image
        src="/img/placeholder/users/1.jpg"
        alt="LoveCard1"
        width={200}
        height={300}
        className="rounded-full w-14 h-14 object-cover mr-5"
        priority
      />
      <div className="max-w-[50%] flex flex-col text-dark dark:text-white justify-center">
        <p className="text-lg font-bold">Alfredo Calzoni</p>
        <p className=" truncate">What about that new jacket if i know you</p>
      </div>
      <div className="flex flex-col items-end ml-auto">
        <div className="bg-pink h-3 w-3 rounded-full"></div>
        <p className="text-sm text-gray-400 font-semibold mt-auto">10:30</p>
      </div>
    </Link>
  );
};

export default function Chats() {
  const { socket } = useSocketStore();
  const { chats, setChats } = useChatsStore();

  const getChats = async () => {
    try {
      const { data } = await customAxios.get('/chat');
      setChats(data);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  // useEffect(() => {
  //   getChats();
  // }, [])

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('message', (body) => {
  //       let message = JSON.parse(body);
  //       setChats((prev) => {
  //         return {
  //           ...prev,
  //           messages: [message, ...prev.messages],
  //         };
  //       });
  //     });
  //   }
  // }, [socket]);

  return (
    <div
      className="-mx-4 md:mx-auto -mb-28 bg-white dark:bg-gray-950 dark:border dark:border-input flex flex-col rounded-t-3xl px-7 pb-32 overflow-scroll"
      style={{
        height: 'calc(100vh - 250px)',
      }}
    >
      {chats.map((chat, index) => (
        <Chat key={index} />
      ))}
      {chats.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-gray-400">No chats</p>
        </div>
      )}
    </div>
  );
}
