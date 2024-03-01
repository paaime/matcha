'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { ResetPasswordSchema } from '@/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import customAxios from '@/utils/axios';

type FormFields = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [open, setOpen] = useState(false);

  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleForgotPassword: SubmitHandler<FormFields> = async (data) => {
    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast('Passwords do not match', { description: 'Error' });
      return;
    }

    try {
      await customAxios.post('/auth/reset-password', {
        email,
        token,
        password
      });

      setOpen(true);
    } catch (err) {
      // console.error(err);
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else
        toast('An error occured', {
          description: 'Error',
        });
    }
  };

  return (
    <>
      {open && (
        <SimpleModal
          title="Password reset successful."
          description="Your password has been reset. You can now login."
          type="success"
        />
      )}
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleForgotPassword)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" value={field.value} onChange={field.onChange}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" value={field.value} onChange={field.onChange}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            isLoading={form.formState.isSubmitting}
            type="submit"
            className="w-full"
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
