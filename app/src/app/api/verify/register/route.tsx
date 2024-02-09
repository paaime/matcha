import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  try {
    // Get the token from the url
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    const user = await db.user.findFirst({
      where: {
        verifyToken: {
          some: {
            AND: [
              {
                createdAt: {
                  gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
                },
              },
              {
                token: token,
              },
              {
                type: 'accountVerification',
              },
            ],
          },
        },
      },
      include: {
        verifyToken: true,
      },
    });

    if (!user) redirect('/auth/sign-in?error=AccountNotVerified');

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        active: true,
      },
    });

    await db.verifyToken.deleteMany({
      where: {
        userId: user.id,
        type: 'accountVerification',
      },
    });
  } catch (err) {
    redirect('/auth/sign-in?error=AccountNotVerified');
  }
  redirect('/auth/sign-in?success=AccountVerified');
}
