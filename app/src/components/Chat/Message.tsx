import clsx from 'clsx';
import Image from 'next/image';

export default function Message({ isMe }) {
  return (
    <div className={clsx('flex gap-3', isMe ? 'flex-row-reverse' : 'flex-row')}>
      <Image
        src="/img/placeholder/LoveCard1.jpg"
        width={50}
        height={50}
        className="rounded-full h-12 w-12 object-cover"
        alt="Profile Picture"
        priority
      />
      <div className="rounded-3xl bg-white flex flex-col items-center py-3 px-5 shadow-sm">
        <p className="text-black">
          Hi, how are you? This is a test with a pretty much longer text to see
          how it work
        </p>
        <p className="text-xs text-gray-400 font-semibold ml-3 self-end">10:30</p>
      </div>
    </div>
  );
}
