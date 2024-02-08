'use client';

import { Button } from '@/components/ui/button';
import { IProfile } from '@/types/profile';
import { ProfileSchema } from '@/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type FormFields = z.infer<typeof ProfileSchema>;

export default function Account({ profile }: { profile: IProfile }) {
  const { update } = useSession();
  const router = useRouter();
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    },
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: async (payload: FormFields) => {
      await axios.patch(`/api/user/`, payload);
      return payload;
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast('Error', {
          description: err.response?.data.error_msg || 'An error occured.',
        });
      return toast('Error', { description: 'An error occured.' });
    },
    onSuccess: async (payload) => {
      await update({
        ...payload,
      });
      toast('✅ Success', {
        description: 'Your account has been updated.',
      });
      router.refresh();
    },
  });

  return (
    <Form {...form}>
      <form
        className="md:col-span-2 space-y-6"
        onSubmit={form.handleSubmit((e) => updateUser(e))}
      >
        <div className="flex-col md:flex-row flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
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
                  <Input placeholder="Last Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>
                Your email is used to log in and send you notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={form.formState.isSubmitting} type="submit">
          Update account
        </Button>
      </form>
    </Form>
  );
}
