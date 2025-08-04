import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { getUserSessions, calculateUnlockedSessions, getAvailableProfessors, bookSession } from '@/lib/sessions';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les séances de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les données complètes de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        completedPages: true,
        gender: true,
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer la progression et les séances débloquées
    const progress = calculateUnlockedSessions(userData.completedPages);
    
    // Récupérer les séances existantes
    const sessions = await getUserSessions(user.id);
    
    // Récupérer les professeurs disponibles selon le genre
    const availableProfessors = userData.gender 
      ? await getAvailableProfessors(userData.gender)
      : [];

    return NextResponse.json({
      progress,
      sessions,
      availableProfessors,
      bookedSessionsCount: sessions.length
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Réserver une séance
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { professorId, scheduledAt } = await request.json();

    if (!professorId || !scheduledAt) {
      return NextResponse.json(
        { error: 'Professeur et date requis' },
        { status: 400 }
      );
    }

    // Récupérer les données de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        completedPages: true,
        gender: true,
      }
    });

    if (!userData || !userData.gender) {
      return NextResponse.json(
        { error: 'Profil utilisateur incomplet' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur peut réserver
    const progress = calculateUnlockedSessions(userData.completedPages);
    if (!progress.canBookSession) {
      return NextResponse.json(
        { error: 'Aucune séance débloquée. Continuez votre progression.' },
        { status: 403 }
      );
    }

    // Vérifier le nombre de séances déjà réservées
    const existingSessions = await prisma.session.count({
      where: { userId: user.id }
    });

    if (existingSessions >= progress.unlockedSessions) {
      return NextResponse.json(
        { error: 'Toutes vos séances débloquées sont déjà réservées' },
        { status: 403 }
      );
    }

    // Réserver la séance
    const result = await bookSession(
      user.id,
      professorId,
      new Date(scheduledAt),
      userData.gender
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      session: result.session
    });
  } catch (error) {
    console.error('Book session error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}