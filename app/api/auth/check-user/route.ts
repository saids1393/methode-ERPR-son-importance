import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    return NextResponse.json({
      exists: !!user,
      isActive: user?.isActive || false
    });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}