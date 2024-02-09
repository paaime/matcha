import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AvatarCard = () => {
  return (
    <div className="flex gap-1 flex-col items-center">
      <div className="border-2 border-blue-400 rounded-full p-1">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm">Selena</p>
    </div>
  );
};

export default function AvatarCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
        <CarouselItem className="basis-1/6">
          <AvatarCard />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
