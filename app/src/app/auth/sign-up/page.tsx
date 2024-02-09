import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignUpForm from '@/components/Auth/SignUp/Form';
import { Button, buttonVariants } from '@/components/ui/button';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import clsx from 'clsx';

export default async function SignUp() {
  const session = await getAuthSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
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
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" type="button" className="w-full">
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" type="button" className="w-full">
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
