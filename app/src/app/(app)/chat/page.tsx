import InputBar from '@/components/Chat/InputBar';
import Message from '@/components/Chat/Message';
import GoBack from '@/components/GoBack';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';

export default function Page() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <GoBack white={false} />
        <p className="font-extrabold text-2xl">Clara Hazel</p>
        <Button variant="outline" className="bg-transparent w-10 h-10 group">
          <MoreHorizontalIcon className="text-black h-6 w-6" />
        </Button>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        <Message isMe={false} />
        <Message isMe={true} />
        <Message isMe={false} />
      </div>
      <InputBar />
    </div>
  );
}
