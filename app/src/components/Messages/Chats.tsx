import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <div
      className="-mx-4 md:mx-auto -mb-28 bg-white dark:bg-gray-950 dark:border dark:border-input flex flex-col rounded-t-3xl px-7"
      style={{
        minHeight: 'calc(100vh - 250px)',
      }}
    >
      <Chat />
      <Chat />
      <Chat />
      <Chat />
      <Chat />
    </div>
  );
}
