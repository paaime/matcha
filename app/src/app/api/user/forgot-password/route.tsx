import { db } from '@/lib/db';
import { ForgotPasswordSchema } from '@/utils/validator';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { randomUUID } from 'crypto';
import { resetPasswordEmail } from '@/mails/resetPassword';

export async function POST(req: Request) {
  try {
    // Get the data from the request
    const { email } = await req.json();

    // Validate the fields
    ForgotPasswordSchema.parse({ email: email });

    // Check if the password is correct
    const user = await db.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: 'success' }, { status: 200 });
    }

    // Generate a random token
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');

    // Create a verification token
    await db.verifyToken.create({
      data: {
        userId: user.id,
        type: 'resetPassword',
        token: token,
        value: 'null',
      },
    });

    await resetPasswordEmail(user, token);

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    console.log(e);
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error_msg: e.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error_msg: 'global_error' }, { status: 500 });
  }
}
