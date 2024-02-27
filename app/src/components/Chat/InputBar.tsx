'use client';

import { SendIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSocketStore } from '@/store';
import { useState } from 'react';

export default function InputBar() {
  const { sendMessage } = useSocketStore();
  const [input, setInput] = useState('');
  return (
    <div className="flex w-full justify-center fixed bottom-5 left-0 h-16 z-30 px-5">
      <div className="flex items-center bg-white px-3 rounded-full gap-2 shadow-lg w-full max-w-[500px] dark:bg-gray-950 dark:border dark:border-input">
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full w-full">
          <Input
            type="search"
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-0 ml-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          className="h-10 w-10 dark:bg-background"
          onClick={() => sendMessage(input)}
        >
          <SendIcon className="h-5 w-5 -ml-0.5 -mb-0.5 dark:text-white" />
        </Button>
      </div>
    </div>
  );
}
