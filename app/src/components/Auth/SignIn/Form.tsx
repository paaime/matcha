'use client';

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
import { useSearchParams } from 'next/navigation';
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
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignInSchema),
  });

  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    console.log(data);
    const { email, password } = data;
    try {
      const response = await axios.post(
        'http://localhost:3001/user/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;
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
