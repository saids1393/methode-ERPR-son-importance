import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { LoginRequest, AuthResponse } from '@/types/auth';

export async function POST(req: Request) {
  try {
    const body: LoginRequest = await req.json();
    
    // Validation basique
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Récupération utilisateur (remplacez par votre logique réelle)
    const user = await getUserByEmail(body.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Vérification mot de passe
    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Création du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Réponse sans le mot de passe
    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    };

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 jour
      path: '/',
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function (à déplacer dans un service dédié)
async function getUserByEmail(email: string): Promise<User | null> {
  // Implémentez votre logique de base de données ici
  return Promise.resolve({
    id: '1',
    email: 'test@example.com',
    password: await bcrypt.hash('password', 10),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}