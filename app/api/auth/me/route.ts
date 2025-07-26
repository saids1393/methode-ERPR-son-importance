import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest, getUserById, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Vérifier si l'utilisateur a un mot de passe défini
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        password: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      hasPassword: userWithPassword?.password !== null
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}