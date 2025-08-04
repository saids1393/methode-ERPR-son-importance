import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    // Vérifier que c'est bien un professeur
    const professor = await prisma.professor.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        isActive: true,
      }
    });

    if (!professor || !professor.isActive) {
      return NextResponse.json(
        { error: 'Professeur non trouvé ou inactif' },
        { status: 401 }
      );
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error('Professor me error:', error);
    return NextResponse.json(
      { error: 'Token invalide' },
      { status: 401 }
    );
  }
}