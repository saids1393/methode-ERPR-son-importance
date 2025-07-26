import { NextResponse } from 'next/server';
import { getUserByEmail, setAuthCookie } from '@/lib/auth';

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

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou inactif' },
        { status: 404 }
      );
    }

    // Connecter l'utilisateur
    await setAuthCookie(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login existing user error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}