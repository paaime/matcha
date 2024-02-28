import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignUpForm from '@/components/Auth/SignUp/Form';
import { Button, buttonVariants } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import clsx from 'clsx';
import Google from '@/components/Auth/Google';

export const metadata = {
  title: 'Matcha | Sign up',
};

export default async function SignUp() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] h-full">
      <Link
        href="/auth/sign-in"
        className={clsx(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Sign in
      </Link>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-extrabold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <SignUpForm />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FDF7FD] dark:bg-gray-900 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <Google />
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
