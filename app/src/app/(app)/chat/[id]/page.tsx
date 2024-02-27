'use client';

import InputBar from '@/components/Chat/InputBar';
import Message from '@/components/Chat/Message';
import GoBack from '@/components/GoBack';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/store';
import customAxios from '@/utils/axios';
import clsx from 'clsx';
import { MoreVerticalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page({ params }) {
  const { socket } = useSocketStore();
  const [chat, setChat] = useState();
  const chatId = params.id;

  const getChat = async () => {
    try {
      const { data } = await customAxios.get(`/chat/${chatId}`);
      setChat(data);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('message', (body) => {
  //       let message = JSON.parse(body);
  //       setChat((prev) => {
  //         return {
  //           ...prev,
  //           messages: [message, ...prev.messages],
  //         };
  //       });
  //     });
  //   }
  // }, [socket]);

  // useEffect(() => {
  //   getChat();
  // }, []);

  return (
    <div>
      <div className="flex justify-center items-center">
        <GoBack white={false} />
        <p className="font-extrabold text-2xl mx-auto">Clara Hazel</p>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        {
          // chat?.messages?.map((message) => {
          //   return <Message isMe={message.isMe} message={message.message} />;
          // })
        }
        <div className={clsx('flex gap-3', 'flex-row')}>
          <div className="rounded-3xl bg-white flex flex-col items-center py-3 px-5 shadow-sm dark:bg-gray-950 dark:border dark:border-input">
            <p className="text-black dark:text-white">
              No messages yet, start the conversation! 🚀
            </p>
          </div>
        </div>
      </div>
      <InputBar chatId={chatId} />
    </div>
  );
}
