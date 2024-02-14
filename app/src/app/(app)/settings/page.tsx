import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Gallery from '@/components/Settings/Gallery';
import Age from '@/components/Settings/Age';
import Interests from '@/components/Settings/Interests';
import Gender from '@/components/Settings/Gender';
import Other from '@/components/Settings/Names';
import Email from '@/components/Settings/Email';
import Password from '@/components/Settings/Password';

export default function Page() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold">Settings</h2>
      <p className="text-gray-500">Change your profile settings</p>
      <Tabs defaultValue="informations" className="w-full mt-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger className="font-bold" value="informations">
            Informations
          </TabsTrigger>
          <TabsTrigger className="font-bold" value="security">
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="informations">
          <Gallery />
          <Interests />
          <Gender />
          <Other />
          <Age />
        </TabsContent>
        <TabsContent value="security">
          <Email />
          <Password />
        </TabsContent>
      </Tabs>
    </div>
  );
}
