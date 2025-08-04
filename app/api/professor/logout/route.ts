import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Supprimer le cookie d'authentification professeur
    response.cookies.set('professor-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error('Professor logout error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}