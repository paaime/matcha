import Likes from '@/components/Likes/Likes';
import LikesSent from '@/components/Likes/LikesSent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Matcha | Likes',
};

export default function Page() {
  return (
    <Tabs defaultValue="likes" className="w-full mt-5">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger className="font-bold" value="likes">
          Likes
        </TabsTrigger>
        <TabsTrigger className="font-bold" value="likes-sent">
          Likes Sent
        </TabsTrigger>
      </TabsList>
      <TabsContent value="likes">
        <Likes />
      </TabsContent>
      <TabsContent value="likes-sent">
        <LikesSent />
      </TabsContent>
    </Tabs>
  );
}
