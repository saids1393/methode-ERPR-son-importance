import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}