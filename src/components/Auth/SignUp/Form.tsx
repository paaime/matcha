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
import { toast } from 'sonner';

type FormFields = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignUpSchema),
  });

  // State
  const [open, setOpen] = useState(false);

  const handleRegister: SubmitHandler<FormFields> = async (data) => {
    const { email, firstName, lastName, password, confirmPassword } = data;
    try {
      const response = await fetch(`/api/register`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          confirmPassword,
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
      toast('Error', {
        description: err.message,
      });
    }
  };

  return (
    <>
      {open && (
        <SimpleModal
          title="Please verify your email."
          description="We have sent you an email with a link to verify your email address. Please click on the link to verify your email address."
          type="success"
        />
      )}
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
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="first-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="last-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
