'use client';

import { Button } from '@/components/ui/button';
import { PasswordSchema, SecuritySchema } from '@/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';
import PasswordModal from './PasswordModal';
import { useState } from 'react';

type SecurityFormFields = z.infer<typeof SecuritySchema>;
type FormFields = z.infer<typeof PasswordSchema>;

export default function Security() {
  const [open, setOpen] = useState(false);
  // 2FA Form
  const twoFactorForm = useForm<SecurityFormFields>({
    resolver: zodResolver(SecuritySchema),
  });
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(PasswordSchema),
  });

  const { mutate: updatePassword } = useMutation({
    mutationFn: async (payload: FormFields) => {
      await axios.patch(`/api/user/password`, payload);
      return payload;
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast('Error', {
          description: err.response?.data.error_msg || 'An error occured.',
        });
      return toast('Error', { description: 'An error occured.' });
    },
    onSuccess: async (payload) => {
      setOpen(true);
    },
  });

  return (
    <div className="space-y-6">
      <PasswordModal open={open} setOpen={setOpen} />
      <Form {...form}>
        <form
          className="md:col-span-2 space-y-6"
          onSubmit={form.handleSubmit((e) => updatePassword(e))}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={form.formState.isSubmitting} type="submit">
            Update
          </Button>
        </form>
      </Form>
      <Form {...twoFactorForm}>
        <form>
          <FormField
            control={twoFactorForm.control}
            name="twoFactor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Two Factor</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
