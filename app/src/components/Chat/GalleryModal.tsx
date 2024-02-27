import { Fragment, useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { GalleryVerticalEnd } from 'lucide-react';
import { useSocketStore, useUserStore } from '@/store';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import Image from 'next/image';

export const GalleryModal = ({ open, setOpen }) => {
  const { socket } = useSocketStore();
  const { user } = useUserStore();
  const [imageId, setImageId] = useState<string>();
  const pictures = user?.pictures?.split(',');

  const sendPicture = () => {
    try {
      if (!imageId) return;
      socket.emit('message', { chatId: user.id, imageId });
      setOpen(false);
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <GalleryVerticalEnd
              className="h-5 w-5 text-green-600"
              aria-hidden="true"
            />
          </div>
          <DialogTitle className="text-center">Send Image</DialogTitle>
        </DialogHeader>
        <RadioGroup
          className="flex flex-wrap justify-center gap-5 pt-2"
          id="images"
          onValueChange={(value) => setImageId(value)}
        >
          {pictures?.map((picture, index) => (
            <Label
              className="bg-white dark:bg-gray-950 flex flex-col gap-3 items-center w-24 h-24 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl cursor-pointer"
              key={index}
            >
              <RadioGroupItem
                value={(index + 1).toString()}
                className="sr-only"
              />
              <Image
                loader={({ src }) => src}
                src={`${process.env.NEXT_PUBLIC_API}${picture}`}
                alt={`Photo ${index}`}
                width={500}
                height={500}
                className="flex items-center justify-center h-full w-full bg-white  rounded-3xl"
                style={{
                  objectFit: 'cover',
                }}
                priority
                unoptimized
              />
            </Label>
          ))}
        </RadioGroup>
        <DialogFooter className="mt-2">
          <Button className="w-full" onClick={sendPicture}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
