'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { PasswordSchema, SignUpSchema } from '@/utils/validator';
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
import customAxios from '@/utils/axios';
import { toast } from 'sonner';

type FormFields = z.infer<typeof PasswordSchema>;

export default function Password() {
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { password, newPassword } = data;
      await customAxios.put('/user/password', {
        current: password,
        newPass: newPassword,
      });
      toast.success('Updated');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else toast.error('An error occurred');
    }
  };

  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Your password</h3>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="password" type="password" value={field.value} onChange={field.onChange}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" value={field.value} onChange={field.onChange}  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" value={field.value} onChange={field.onChange}  />
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
