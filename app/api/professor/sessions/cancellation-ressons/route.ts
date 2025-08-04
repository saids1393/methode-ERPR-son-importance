import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les motifs d'annulation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'STUDENT' ou 'PROFESSOR'

    // Vérifier l'authentification (étudiant ou professeur)
    const userToken = request.cookies.get('auth-token')?.value;
    const professorToken = request.cookies.get('professor-token')?.value;

    if (!userToken && !professorToken) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Déterminer la catégorie si pas spécifiée
    let targetCategory = category;
    if (!targetCategory) {
      if (professorToken) {
        targetCategory = 'PROFESSOR';
      } else {
        targetCategory = 'STUDENT';
      }
    }

    const reasons = await prisma.cancellationReason.findMany({
      where: {
        category: targetCategory,
        isActive: true
      },
      orderBy: { reason: 'asc' }
    });

    return NextResponse.json({ reasons });
  } catch (error) {
    console.error('Get cancellation reasons error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}