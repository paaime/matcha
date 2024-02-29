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
import axios from 'axios';

type FormFields = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  });

  // State
  const [open, setOpen] = useState(false);

  const handleRegister: SubmitHandler<FormFields> = async (data) => {
    const { email, firstName, lastName, password, confirmPassword } = data;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
      });
      setOpen(true);
    } catch (err) {
      if (err.response?.data?.message)
        toast(err.response?.data?.message, { description: 'Error' });
      else toast('Error', { description: 'Something went wrong' });
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
                  <Input {...field} type="email" value={field.value} onChange={field.onChange} />
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
                    <Input {...field} autoComplete="given-name" value={field.value} onChange={field.onChange} />
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
                    <Input {...field} autoComplete="family-name" value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} type="text" autoComplete='none' value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" autoComplete='new-password' value={field.value} onChange={field.onChange} />
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
                  <Input {...field} type="password" autoComplete='new-password' value={field.value} onChange={field.onChange} />
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
