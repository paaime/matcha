import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { DigitSchema } from '@/utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type FormFields = z.infer<typeof DigitSchema>;

export default function PasswordModal({ open, setOpen }) {
  const form = useForm<FormFields>({
    resolver: zodResolver(DigitSchema),
  });

  const { mutate: verifyPassword } = useMutation({
    mutationFn: async (payload: FormFields) => {
      await axios.post(`/api/verify/password`, payload);
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
      toast('✅ Success', {
        description: 'Your password has been updated',
      });
      setOpen(false);
    },
  });
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify the changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have received a digit code to your email. Please enter the code
            to accept the changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="md:col-span-2 space-y-6"
            onSubmit={form.handleSubmit((e) => verifyPassword(e))}
          >
            <FormField
              control={form.control}
              name="digit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter the code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="block ml-auto"
            >
              Confirm
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
