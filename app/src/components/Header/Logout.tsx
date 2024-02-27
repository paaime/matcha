import { LogOutIcon } from 'lucide-react';
import { Button } from '../ui/button';
import customAxios from '@/utils/axios';

export default function Logout() {
  const logout = async () => {
    await customAxios.post('/auth/logout');
    window.location.href = '/';
  };
  return (
    <Button
      variant="outline"
      className="rounded-full h-10 w-10"
      onClick={logout}
    >
      <LogOutIcon className="h-5 w-5" />
    </Button>
  );
}
