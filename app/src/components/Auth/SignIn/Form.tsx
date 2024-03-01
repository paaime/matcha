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
  const getGPSLocation = async () => {
    const gpsSuccess = (pos) => {
      if (pos.coords) {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
  
        return { lat, lon };
      } else {
        return null;
      }
    };
  
    const options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: Infinity
    };
  
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
  
      return gpsSuccess(position) || null;
    } catch (error) {
      return null;
    }
  };

  const getIPLocation = async() => {
    const datas = await fetch('https://ipapi.co/json/')
    const data = await datas.json();

    let lat = data.latitude;
    let lon = data.longitude;

    if (lat && lon) {
      return { lat, lon };
    }

    return null;
  };

  const getCoords = async () => {
    const coords = await getGPSLocation();
    if (coords) {
      return coords;
    } else {
      return await getIPLocation();
    }
  }

  const { push } = useRouter();
  // Form
  const form = useForm<FormFields>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    const { username, password } = data;

    
    try {
      const coords = await getCoords();

      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          username,
          password,
          coords
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
