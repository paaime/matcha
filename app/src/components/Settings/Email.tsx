'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleModal from '@/components/ui/Modals/SimpleModal';
import { SignUpSchema } from '@/utils/validator';
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

type FormFields = z.infer<typeof SignUpSchema>;

export default function Email() {
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignUpSchema),
  });

  const handleRegister = () => {};

  return (
    <div className="flex flex-col mt-5">
      <h3 className="text-xl font-extrabold mb-5">Your email</h3>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleRegister)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="first-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className="mt-10">Save</Button>
    </div>
  );
}
