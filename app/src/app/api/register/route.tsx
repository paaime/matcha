import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignUpSchema } from '@/utils/validator';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import { verifyAccountEmail } from '@/mails/verify';

export async function POST(req) {
  try {
    const { email, lastName, firstName, password, confirmPassword } =
      await req.json();

    // Validate the fields
    SignUpSchema.parse({
      email,
      lastName,
      firstName,
      password,
      confirmPassword,
    });

    // Check if the passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error_msg: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const emailCheck = await db.user.findUnique({
      where: { email: email },
    });

    if (emailCheck) {
      return NextResponse.json(
        { error_msg: 'Email already exists.' },
        { status: 400 }
      );
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    const user = await db.user.create({
      data: {
        email: email,
        lastName: lastName,
        firstName: firstName,
        password: hashedPassword,
        active: false,
      },
    });

    // Generate a random token
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');

    // create the activation token
    await db.verifyToken.create({
      data: {
        value: 'null',
        type: 'accountVerification',
        userId: user.id,
        token: token,
      },
    });

    const mail = await verifyAccountEmail(user, token);

    if (!mail) {
      return NextResponse.json(
        { message: 'An error occurred while registering the user.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error_msg: e.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'An error occurred while registering the user.' },
      { status: 500 }
    );
  }
}
