import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, getUserById } from '@/lib/auth';

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    try {
      const decoded = verifyToken(token);
      
      // Récupération de l'utilisateur
      const user = await getUserById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}