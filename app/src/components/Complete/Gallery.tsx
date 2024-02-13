import { CameraIcon, PlusIcon, SmileIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { FaSmile } from 'react-icons/fa';
import { Dispatch, SetStateAction } from 'react';

const fakeInterests = [
  '🎵 Music',
  '🚀 Travel',
  '🍔 Food',
  '💙 Fashion',
  '💻 Technology',
  '🕹️ Gaming',
  '⚽️ Sports',
  '🎨 Art',
  '📸 Photography',
  '🏋️ Fitness',
  '📚 Reading',
  '🖊️ Writing',
];

export default function Gallery({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col animate__animated animate__fadeIn animate__faster">
      <h3 className="text-2xl font-extrabold text-center mb-5">
        Upload your photos
      </h3>
      <div className="photo-gallery h-96 mx-auto w-full max-w-[400px]">
        <div
          className="photo-1 flex items-end justify-center pb-5 rounded-3xl"
          style={{
            backgroundImage: "url('/img/placeholder/users/1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Button className="bg-white/30 backdrop-blur-sm rounded-full border border-[#ffffff1a] hover:bg-white/40">
            <CameraIcon className="mr-2 h-5 w-5" />
            Change Photo
          </Button>
        </div>
        <div className="photo-2 flex flex-col bg-white rounded-3xl p-4 justify-between items-center">
          <FaSmile className="h-10 w-10 text-gray-200" />
          <Button className="bg-pink hover:bg-pink/80">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="photo-3 flex flex-col bg-white rounded-3xl p-4 justify-between items-center">
          <FaSmile className="h-10 w-10 text-gray-200" />
          <Button className="bg-pink hover:bg-pink/80">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="photo-4 flex flex-col bg-white rounded-3xl p-4 justify-between items-center">
          <FaSmile className="h-10 w-10 text-gray-200" />
          <Button className="bg-pink hover:bg-pink/80">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="photo-5 flex flex-col bg-white rounded-3xl p-4 justify-between items-center">
          <FaSmile className="h-10 w-10 text-gray-200" />
          <Button className="bg-pink hover:bg-pink/80">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="photo-6 flex flex-col bg-white rounded-3xl p-4 justify-between items-center">
          <FaSmile className="h-10 w-10 text-gray-200" />
          <Button className="bg-pink hover:bg-pink/80">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
      <Button
        className="mx-auto mt-10 w-52"
        onClick={() => setStep((prev) => prev + 1)}
      >
        Continue
      </Button>
    </div>
  );
}
