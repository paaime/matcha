'use client';

import { CameraIcon, PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { FaSmile } from 'react-icons/fa';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

export const GalleryImage = ({ id, picture }) => {
  const { user, setUser } = useUserStore();

  const handleUpload = async (event, imageId: number) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const { data } = await customAxios.put(
        `/user/image/${imageId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser({ ...user, pictures: data.newPictures });
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occured');
    }
  };

  return (
    <div
      className={`photo-${id} flex flex-col items-center justify-between pb-5 rounded-3xl bg-white dark:bg-background`}
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_API}${picture}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {(picture?.length < 1 || !picture) && (
        <FaSmile className="w-10 text-gray-200 dark:text-gray-500 h-full py-4" />
      )}
      {picture?.length > 0 ? (
        <Button className="bg-white/30 backdrop-blur-sm rounded-full border border-[#ffffff1a] hover:bg-white/40 mt-auto dark:text-white">
          <form encType="multipart/form-data">
            <input
              type="file"
              accept="image/*"
              name="image"
              className="opacity-0 w-full h-full absolute cursor-pointer"
              onChange={(e) => handleUpload(e, id)}
            />
          </form>
          <CameraIcon className="mr-2 h-5 w-5" />
          Change
        </Button>
      ) : (
        <Button className="bg-pink hover:bg-pink/80 relative dark:text-white">
          <form encType="multipart/form-data">
            <input
              type="file"
              accept="image/*"
              name="image"
              className="opacity-0 w-full h-full absolute cursor-pointer"
              onChange={(e) => handleUpload(e, id)}
            />
          </form>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add
        </Button>
      )}
    </div>
  );
};

export default function Gallery() {
  const { user } = useUserStore();
  const pictures = user?.pictures?.split(',');

  return (
    <div className="flex flex-col mt-5">
      <div className="photo-gallery mx-auto w-full">
        <GalleryImage id={1} picture={pictures?.[0]} />
        <GalleryImage id={2} picture={pictures?.[1]} />
        <GalleryImage id={3} picture={pictures?.[2]} />
        <GalleryImage id={4} picture={pictures?.[3]} />
        <GalleryImage id={5} picture={pictures?.[4]} />
      </div>
    </div>
  );
}
