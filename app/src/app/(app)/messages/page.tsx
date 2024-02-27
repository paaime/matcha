import Chats from '@/components/Messages/Chats';
import Matches from '@/components/Messages/Matches';

export const metadata = {
  title: 'Matcha | Messages',
};

export default function Page() {
  return (
    <div>
      <div className="mb-5">
        <p className="pl-0 sm:pl-5 text-black dark:text-white font-semibold mb-3">
          Recent Matches
        </p>
        <Matches />
      </div>
      <Chats />
    </div>
  );
}
