import Customization from '@/components/Settings/Customization';

export default async function Page() {
  return (
    <div className="w-full space-y-6 lg:max-w-2xl">
      <div className="border-b pb-5">
        <h3 className="text-lg font-medium">Customization</h3>
        <p className="text-sm text-muted-foreground">
          Customize your experience
        </p>
      </div>
      <Customization />
    </div>
  );
}
