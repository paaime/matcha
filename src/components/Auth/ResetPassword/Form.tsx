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

type FormFields = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [open, setOpen] = useState(false);

  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const handleForgotPassword: SubmitHandler<FormFields> = async (data) => {
    const { password, confirmPassword } = data;
    try {
      const response = await fetch(`/api/user/reset-password`, {
        method: 'POST',
        body: JSON.stringify({
          password,
          confirmPassword,
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_msg || 'Something went wrong');
      }

      setOpen(true);
    } catch (err) {
      toast('Error', { description: err.message });
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
                  <Input {...field} type="password" />
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
                  <Input {...field} type="password" />
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
