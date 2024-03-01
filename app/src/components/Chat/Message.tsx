import { useUserStore } from '@/store';
import { IMessage } from '@/types/chat';
import { timeSince } from '@/utils/time';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Message({
  isMe,
  message,
}: {
  isMe: boolean;
  message: IMessage;
}) {
  const { user } = useUserStore();
  const { push } = useRouter();
  const pictures = isMe? user?.pictures?.split(',') : message?.pictures?.split(',');

  return (
    <div className={clsx('flex gap-3', isMe ? 'flex-row-reverse' : 'flex-row')}>
      <Image
        loader={({ src }) => src}
        src={`${pictures[0].startsWith('http') ? '' : process.env.NEXT_PUBLIC_API}${pictures[0]}`}
        width={50}
        height={50}
        className="rounded-full h-12 w-12 object-cover"
        alt={message.created_at}
        priority
        unoptimized
        onClick={() => push(`/profile/${isMe ? user?.username : message?.username}`)}
      />
      <div className="rounded-3xl bg-white flex flex-col py-3 px-5 shadow-sm dark:bg-gray-950 dark:border dark:border-input">
        <p className="text-black dark:text-white">{message.content}</p>
        <p className="text-xs text-gray-400 font-semibold ml-3 self-end">
          {timeSince(message.created_at.replace('Z', ''))}
        </p>
      </div>
    </div>
  );
}
