'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { SignInSchema } from '@/utils/validator';
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
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

type FormFields = z.infer<typeof SignInSchema>;

export default function SignInForm({
  modalContent,
}: {
  modalContent?: {
    title: string;
    description: string;
    type: string;
  };
}) {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl');
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignInSchema),
  });

  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;
    try {
      const response = await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/default',
        redirect: false,
      });

      if (response.error) {
        switch (response.error) {
          case 'CredentialsSignin':
            toast('Error', { description: 'Invalid credentials.' });
            break;
          case 'NotActivated':
            toast('Error', { description: 'Account not activated.' });
            break;
          default:
            toast('Error', { description: 'An error occured.' });
            break;
        }
      }

      if (response.ok) {
        toast('Success', { description: 'Logged in successfully.' });
        if (callbackUrl) {
          window.location.href = callbackUrl;
        } else window.location.href = '/dashboard';
      }
    } catch (err) {
      toast('Error', { description: err.message });
    }
  };

  return (
    <>
      {modalContent && <SimpleModal {...modalContent} />}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button
            isLoading={form.formState.isSubmitting}
            type="submit"
            className="w-full font-bold"
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
