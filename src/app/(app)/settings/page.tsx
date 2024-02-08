import { headers } from 'next/headers';
import { IProfile } from '@/types/profile';
import Account from '@/components/Settings/Account';

async function getProfile() {
  const response = await fetch(`${process.env.DOMAIN}/api/user`, {
    headers: new Headers(headers()),
  });

  const data: IProfile = await response.json();
  return data;
}

export default async function Settings() {
  const profile = await getProfile();

  return (
    <div className="w-full space-y-6 lg:max-w-2xl">
      <div className="border-b pb-5">
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Edit your account settings
        </p>
      </div>
      <Account profile={profile} />
    </div>
  );
}
