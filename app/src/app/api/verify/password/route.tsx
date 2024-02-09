import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { DigitSchema } from '@/utils/validator';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Get the data from the request
    const { digit } = await req.json();

    if (!session?.user) {
      return NextResponse.json(
        { error_msg: 'login_required' },
        { status: 401 }
      );
    }

    const user = await db.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error_msg: 'global_error' }, { status: 404 });
    }

    // Validate the fields
    DigitSchema.parse({
      digit: digit,
    });

    // Find the token
    const verifyToken = await db.verifyToken.findFirst({
      where: {
        userId: user.id,
        type: 'passwordChange',
        token: digit,
      },
    });

    if (!verifyToken) {
      return NextResponse.json({ error_msg: 'token_invalid' }, { status: 400 });
    }

    // Update the password
    const newPassword = verifyToken.value;
    await db.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
      },
    });

    // Delete the token
    await db.verifyToken.delete({
      where: {
        id: verifyToken.id,
      },
    });

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error_msg: e.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error_msg: 'global_error' }, { status: 500 });
  }
}
