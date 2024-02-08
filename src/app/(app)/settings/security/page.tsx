import Security from '@/components/Settings/Security';

export default async function Settings() {
  return (
    <div className="w-full space-y-6 lg:max-w-2xl">
      <div className="border-b pb-5">
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Your account security settings
        </p>
      </div>
      <Security />
    </div>
  );
}
