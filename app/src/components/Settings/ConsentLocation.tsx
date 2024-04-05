'use client';

import { Button } from '../ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

export default function ConsentLocation() {
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [consent, setConsent] = useState<boolean>(user.consentLocation);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await customAxios.put('/user/consentLocation', {
        consent,
      });
      setUser({ ...user, consentLocation: consent });
      toast.success('Updated');
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message, {
          description: 'Error',
        });
      } else
        toast.error('An error occurred', {
          description: 'Error',
        });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Consent location</h3>
      <Switch
        id="consent-location"
        checked={consent}
        onCheckedChange={(checked) => setConsent(checked)}
      />
      <Button
        isLoading={loading}
        className="mx-auto mt-10 w-full dark:bg-background dark:text-white dark:border dark:border-input"
        onClick={handleSubmit}
      >
        Save
      </Button>
    </div>
  );
}
