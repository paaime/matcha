'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { SignInSchema } from '@/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

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
  const { push } = useRouter();

  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    localStorage.removeItem('loc-updated');
  }, []);
  
  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    const { username, password } = data;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          username,
          password
        },
        {
          withCredentials: true,
        }
      );
      push('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        toast('Error', { description: err.response?.data?.message });
      } else toast('Error', { description: 'Something went wrong' });
    }
  };

  return (
    <>
      {modalContent && <SimpleModal {...modalContent} />}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} type="text" value={field.value} onChange={field.onChange} />
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
                  <Input {...field} type="password" value={field.value} onChange={field.onChange} />
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
