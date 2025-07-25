import { NextResponse } from 'next/server';
import { signUpSchema } from '@/lib/validation';
import { createUser, generateToken, getUserByEmail } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation avec Zod
    const validationResult = signUpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, email, password } = validationResult.data;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Création de l'utilisateur
    const newUser = await createUser({
      username,
      email,
      password
    });

    // Génération du token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/',
    });

    return NextResponse.json({
      user: newUser,
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}