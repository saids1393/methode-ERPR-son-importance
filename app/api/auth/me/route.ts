import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest, getUserById, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte inactif' },
        { status: 401 }
      );
    }

    // Retourne uniquement les données publiques (pas le mot de passe etc)
    const { id, email, username, isActive } = user;

    return NextResponse.json({ id, email, username, isActive });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}