'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useChatsStore } from '@/store';
import Link from 'next/link';
import clsx from 'clsx';
import { buttonVariants } from '../ui/button';
import { IPreviewChat } from '@/types/chat';

const Match = ({ chat }: { chat: IPreviewChat }) => {
  const pictures = chat.pictures?.split(',') || [];
  return (
    <Image
      loader={({ src }) => src}
      src={`${pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${pictures[0]}`}
      alt={chat.username}
      width={200}
      height={300}
      className="rounded-lg w-24 h-28 object-cover"
      priority
      unoptimized
    />
  );
};

export default function Matches() {
  const { chats } = useChatsStore();

  if (!chats || chats.length === 0)
    return (
      <div className="flex flex-col items-center justify-center my-12">
        <p className="text-lg font-bold">You don&apos;t have any matches</p>
        <p className="text-gray-400">You can still discover other profile</p>
      </div>
    );

  return (
    <Swiper
      slidesPerView={3.3}
      spaceBetween={20}
      pagination={{
        clickable: true,
      }}
      className="!-ml-5 sm:!ml-auto !pl-5"
      breakpoints={{
        580: {
          slidesPerView: 4.5,
        },
      }}
    >
      {chats.map((chat, index) => (
        <SwiperSlide key={index}>
          <Match chat={chat} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
