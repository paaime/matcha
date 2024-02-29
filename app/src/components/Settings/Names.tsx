'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NameSchema } from '@/utils/validator';
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
import { toast } from 'sonner';
import customAxios from '@/utils/axios';
import { useUserStore } from '@/store';

type FormFields = z.infer<typeof NameSchema>;

export default function Names() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const handleSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { firstName, lastName } = data;
      await customAxios.put('/user/name', {
        first: firstName,
        last: lastName,
      });
      setUser({ ...user, firstName, lastName });
      toast.success('Updated');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else toast.error('An error occurred');
    }
  };

  return (
    <div className="flex flex-col border-t mt-10 pt-5">
      <h3 className="text-xl font-extrabold mb-5">Names</h3>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              defaultValue={user.firstName}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="given-name" value={field.value} onChange={field.onChange}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              defaultValue={user.lastName}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="family-name" value={field.value} onChange={field.onChange}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="username"
            defaultValue={user.username}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username (read only)</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="none" value={field.value} onChange={field.onChange} readOnly  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            isLoading={form.formState.isSubmitting}
            className="mt-10 w-full dark:bg-background dark:text-white dark:border dark:border-input"
            type="submit"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
