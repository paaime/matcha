'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmailSchema } from '@/utils/validator';
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
import { useUserStore } from '@/store';
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

type FormFields = z.infer<typeof EmailSchema>;

export default function Email() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: user.email,
    },
  });

  const handleSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { email } = data;
      await customAxios.put('/user/email', {
        email,
      });
      setUser({ ...user, email });
      toast.success('Updated');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else toast.error('An error occurred');
    }
  };

  return (
    <div className="flex flex-col mt-5">
      <h3 className="text-xl font-extrabold mb-5">Your email</h3>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="email"
            defaultValue={user.email}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="email" type="email" value={field.value} onChange={field.onChange}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            isLoading={form.formState.isSubmitting}
            className="mt-10 w-full dark:bg-background dark:text-white dark:border dark:border-input"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
