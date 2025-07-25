import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signInSchema } from '@/lib/validation';
import { getUserByEmail, verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation avec Zod
    const validationResult = signInSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Récupération utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Vérification mot de passe
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Génération du token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/',
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}