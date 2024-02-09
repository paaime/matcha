import { HeartIcon, StarIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import CircleProgress from '../ui/CircleProgress';

const LoveCard = () => {
  return (
    <div
      className="rounded-3xl"
      style={{
        backgroundImage: 'url(/img/placeholder/LoveCard1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 'calc(100vh - 450px)',
        minHeight: '250px',
      }}
    >
      <div
        className="flex flex-col justify-between  p-5 h-full love-card rounded-3xl"
        style={{
          background:
            'linear-gradient(to top, rgb(5 20 90 / 84%), transparent)'
        }}
      >
        <div className="flex justify-between items-start">
          <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
            <p>2.5 km away</p>
          </div>
          <CircleProgress />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-extrabold text-white text-2xl">Xavier Niel, 20</p>
          <p className="text-[#C0AFC0] font-semibold tracking-wider">
            HAMBURG, GERMANY
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LoveCarousel() {
  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl p-3 z-10">
        <LoveCard />

        <div className="flex gap-8 justify-center pb-4 pt-6">
          <Button className="h-14 w-14 rounded-full bg-white shadow-xl text-black">
            <XIcon />
          </Button>
          <Button className="h-14 w-14 rounded-full bg-primary shadow-xl text-white">
            <StarIcon className="fill-white" />
          </Button>
          <Button className="h-14 w-14 rounded-full bg-pink shadow-xl text-white">
            <HeartIcon className="fill-white" />
          </Button>
        </div>
      </div>
      <div className="mx-auto w-11/12 bg-white rounded-3xl shadow-2xl h-[60px] mt-[-70px]"></div>
    </>
  );
}
