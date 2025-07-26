import { NextResponse } from 'next/server';
import { getUserByEmail, generateToken } from '@/lib/auth';

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

    // Générer un token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive
      }
    });

    // Définir le cookie d'authentification
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login existing user error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}