import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ResetPasswordSchema } from '@/utils/validator';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Get the token from the url

    const { token, password, confirmPassword } = await req.json();

    console.log(token, password, confirmPassword);

    const user = await db.user.findFirst({
      where: {
        verifyToken: {
          some: {
            AND: [
              {
                token: token,
              },
              {
                type: 'resetPassword',
              },
            ],
          },
        },
      },
      include: {
        verifyToken: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error_msg: 'invalid_token' }, { status: 404 });
    }

    ResetPasswordSchema.parse({
      password: password,
      confirmPassword: confirmPassword,
    });

    // Check if the passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error_msg: 'password_mismatch' },
        { status: 400 }
      );
    }

    // Update the password
    await db.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });

    // Delete the token
    await db.verifyToken.deleteMany({
      where: {
        userId: user.id,
        type: 'resetPassword',
      },
    });

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error_msg: 'global_error' }, { status: 500 });
  }
}
