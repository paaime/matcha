import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import clsx from 'clsx';
import ForgotPasswordForm from '@/components/Auth/ForgotPassword/Form';

export default async function ForgotPassword() {

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to reset your password
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        We will send you an email with instructions on how to reset your
        password.
      </p>
    </div>
  );
}
