'use client';

import { HeartIcon, StarIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import CircleProgress from '../ui/CircleProgress';

interface ILoveCard {
  id: number;
  name: string;
  age: number;
  location: string;
  distance: number;
  image: string;
}

const data = [
  {
    id: 1,
    name: 'Xavier Niel',
    age: 20,
    location: 'Hamburg, Germany',
    distance: 2.5,
    image: '/img/placeholder/LoveCard1.jpg',
  },
  {
    id: 2,
    name: 'Xavier Niel',
    age: 20,
    location: 'Hamburg, Germany',
    distance: 2.5,
    image: '/img/placeholder/LoveCard2.jpg',
  },
  {
    id: 3,
    name: 'Xavier Niel',
    age: 20,
    location: 'Hamburg, Germany',
    distance: 2.5,
    image: '/img/placeholder/LoveCard3.jpg',
  },
  {
    id: 4,
    name: 'Xavier Niel',
    age: 20,
    location: 'Hamburg, Germany',
    distance: 2.5,
    image: '/img/placeholder/LoveCard4.jpg',
  },
];

const LoveCard = ({ id, name, age, location, distance, image }: ILoveCard) => {
  return (
    <div
      className="rounded-3xl"
      style={{
        backgroundImage: `url(${image})`,
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
            'linear-gradient(to top, rgb(5 20 90 / 84%), transparent)',
        }}
      >
        <div className="flex justify-between items-start">
          <div className="border border-[#ffffff1a] backdrop-blur-sm rounded-full py-2 px-4 text-white bg-white/30 font-semibold w-fit">
            <p>{distance} km away</p>
          </div>
          <CircleProgress />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="font-extrabold text-white text-2xl">
            {name}, {age}
          </p>
          <p className="text-[#C0AFC0] font-semibold tracking-wider">
            {location}
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
        {data.map((card, index) => (
          <LoveCard {...card} key={index} />
        ))}

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
