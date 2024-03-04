'use client';

import { GalleryVerticalEndIcon, LandPlotIcon, SendIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'sonner';
import { InvitationModal } from './InvitationModal';
import customAxios from '@/utils/axios';
import { IChat } from '@/types/chat';

export default function InputBar({
  chatId,
  setChat,
}: {
  chatId: string;
  setChat: Dispatch<SetStateAction<IChat>>;
}) {
  const [openInvitation, setOpenInvitation] = useState(false);
  const [input, setInput] = useState('');

  const handleUpload = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { data } = await customAxios.post(
        `/chat/${chatId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setChat((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, data],
        };
      });
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occured');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      if (!input) return;
      const { data } = await customAxios.post(`/chat/${chatId}`, {
        content: input,
      });
      setChat((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, data],
        };
      });
      setInput('');
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  return (
    <div className="flex w-full justify-center fixed bottom-5 left-0 h-16 z-30 px-5">
      <div className="flex items-center bg-white px-3 rounded-full gap-2 shadow-lg w-full max-w-[500px] dark:bg-gray-950 dark:border dark:border-input">
        <form onSubmit={sendMessage} className="flex items-center w-full gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full w-full">
            <Input
              type="search"
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-0 ml-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              value={input}
            />
          </div>
          <Button type="submit" className="h-10 w-10 dark:bg-background">
            <SendIcon className="h-5 w-5 -ml-0.5 -mb-0.5 dark:text-white" />
          </Button>
        </form>
        <Button className="h-10 w-10 dark:bg-background" type="button">
          <form encType="multipart/form-data">
            <input
              type="file"
              accept="image/*"
              name="image"
              className="opacity-0 w-full h-full absolute cursor-pointer"
              onChange={(e) => handleUpload(e)}
            />
          </form>
          <GalleryVerticalEndIcon className="h-5 w-5 -ml-0.5 -mb-0.5 dark:text-white" />
        </Button>
        <Button
          className="h-10 w-10 dark:bg-background"
          type="button"
          onClick={() => setOpenInvitation(true)}
        >
          <LandPlotIcon className="h-5 w-5 -ml-0.5 -mb-0.5 dark:text-white" />
        </Button>

        <InvitationModal
          open={openInvitation}
          setOpen={setOpenInvitation}
          matchId={chatId}
        />
      </div>
    </div>
  );
}
