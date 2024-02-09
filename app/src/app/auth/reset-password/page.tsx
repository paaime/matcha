import Link from 'next/link';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import clsx from 'clsx';
import ResetPasswordForm from '@/components/Auth/ResetPassword/Form';

export default async function ForgotPassword() {
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
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <ResetPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        The change will be effective immediately and you will be able to login
        with your new password.
      </p>
    </div>
  );
}
