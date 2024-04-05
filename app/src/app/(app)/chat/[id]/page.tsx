/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import InputBar from '@/components/Chat/InputBar';
import Message from '@/components/Chat/Message';
import GoBack from '@/components/GoBack';
import { useSocketStore, useUserStore } from '@/store';
import { IChat } from '@/types/chat';
import customAxios from '@/utils/axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Page({ params }) {
  const { socket } = useSocketStore();
  const { user } = useUserStore();
  const [chat, setChat] = useState<IChat>();
  const chatId = params.id;
  const messagesEndRef = useRef(null);

  const getChat = async () => {
    try {
      const { data } = await customAxios.get(`/chat/${chatId}`);
      setChat(data);
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('message', (body) => {
        let message = JSON.parse(body);
        if (message.match_id.toString() !== chatId) return;
        setChat((prev) => {
          return {
            ...prev,
            messages: [...prev.messages, message],
          };
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  useEffect(() => {
    getChat();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  return (
    <div>
      <div className="flex justify-center items-center">
        <GoBack white={false} />
        <p className="font-extrabold text-2xl mx-auto">{chat?.firstName}</p>
      </div>
      <div
        className="flex flex-col gap-5 mt-10 overflow-scroll"
        style={{
          height: 'calc(100vh - 275px)',
        }}
      >
        {chat?.messages?.map((message, index) => (
          <Message
            isMe={message.user_id === user.id}
            message={message}
            key={index}
          />
        ))}

        {chat?.messages?.length === 0 && (
          <div className={clsx('flex gap-3', 'flex-row')}>
            <div className="rounded-3xl bg-white flex flex-col items-center py-3 px-5 shadow-sm dark:bg-gray-950 dark:border dark:border-input">
              <p className="text-black dark:text-white">
                No messages yet, start the conversation! 🚀
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <InputBar chatId={chatId} setChat={setChat} />
    </div>
  );
}
