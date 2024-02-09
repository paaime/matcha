import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const data = { message: 'Hello from Next.js!' };

    return new Response(JSON.stringify(data));
  } catch (e) {
    return NextResponse.json(
      { error_msg: 'Something went wrong, please try again.' },
      { status: 500 }
    );
  }
}