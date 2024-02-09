import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ProfileSchema } from '@/utils/validator';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Get the data from the request
    const { firstName, lastName, email } = await req.json();

    if (!session?.user) {
      return NextResponse.json(
        { error_msg: 'You have to be logged in.' },
        { status: 401 }
      );
    }

    // Validate the fields
    ProfileSchema.parse({
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    // Check if the email is already in use and it's not the user's email
    const userWithEmail = await db.user.findFirst({
      where: { email: email },
    });

    if (userWithEmail && userWithEmail.email !== session.user.email) {
      return NextResponse.json(
        { error_msg: 'email_already_in_use' },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: { email: session.user.email },
    });

    // Update the user
    await db.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    });

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error_msg: e.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error_msg: 'You have to be logged in.' },
        { status: 401 }
      );
    }

    const user = await db.user.findFirst({
      where: { email: session.user.email },
    });

    const data = {
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName,
    };

    return new Response(JSON.stringify(data));
  } catch (e) {
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}
