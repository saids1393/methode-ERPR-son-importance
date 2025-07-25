import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { RegisterRequest, AuthResponse } from '@/types/auth';

export async function POST(req: Request) {
  try {
    const body: RegisterRequest = await req.json();
    
    // Validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Création de l'utilisateur (remplacez par votre logique réelle)
    const newUser: User = {
      id: generateId(),
      email: body.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Sauvegarde de l'utilisateur
    await createUser(newUser);

    // Réponse (sans le mot de passe)
    const response: AuthResponse = {
      user: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      token: generateToken(newUser) // Implémentez cette fonction
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}