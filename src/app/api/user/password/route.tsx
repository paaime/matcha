import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { PasswordSchema } from '@/utils/validator';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { verifyPasswordEmail } from '@/mails/verify';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Get the data from the request
    const { password, newPassword, confirmNewPassword } = await req.json();

    if (!session?.user) {
      return NextResponse.json(
        { error_msg: 'login_required' },
        { status: 401 }
      );
    }

    // Validate the fields
    PasswordSchema.parse({
      password: password,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    });

    // Check if the passwords match
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error_msg: 'password_mismatch' },
        { status: 400 }
      );
    }

    // Check if the password is correct
    const user = await db.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error_msg: 'global_error' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error_msg: 'password_incorrect' },
        { status: 400 }
      );
    }

    // Generate a random 6 digit number
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a verification token
    await db.verifyToken.create({
      data: {
        userId: user.id,
        type: 'passwordChange',
        token: token,
        value: await bcrypt.hash(newPassword, 10),
      },
    });

    await verifyPasswordEmail(user, token);

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
