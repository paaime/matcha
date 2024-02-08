'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <div className="flex items-center" onClick={() => signOut()}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </div>
  );
}
