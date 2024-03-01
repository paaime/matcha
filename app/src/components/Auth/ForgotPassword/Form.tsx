'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { ForgotPasswordSchema } from '@/utils/validator';
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

type FormFields = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
    },
  });

  const handleForgotPassword: SubmitHandler<FormFields> = async (data) => {
    const { email } = data;
    try {
      await customAxios.post('/auth/forgot-password', {
        email,
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
          title="Check your email"
          description="We have sent you an email with instructions to reset your password."
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" value={field.value} onChange={field.onChange}  />
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
