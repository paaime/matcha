import Link from 'next/link';
import { redirect } from 'next/navigation';
import SignInForm from '@/components/Auth/SignIn/Form';
import { Button, buttonVariants } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import clsx from 'clsx';

export default async function SignIn({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let modalContent = null;

  if (searchParams?.success) {
    modalContent = {
      title: 'Verification successful.',
      description: 'Your email address has been verified. You can now login.',
      type: 'success',
    };
  } else if (searchParams?.error) {
    modalContent = {
      title: 'Verification failed.',
      description: 'Your email address could not be verified.',
      type: 'error',
    };
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] h-full">
      <Link
        href="/auth/sign-up"
        className={clsx(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Sign up
      </Link>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-extrabold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in
        </p>
      </div>
      <SignInForm modalContent={modalContent} />
      <Link
        href="/auth/forgot-password"
        className="px-8 text-center text-sm text-muted-foreground hover:underline"
      >
        Forgot your password?
      </Link>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FDF7FD] px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" type="button" className="w-full text-black">
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" className="w-full text-black">
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
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
