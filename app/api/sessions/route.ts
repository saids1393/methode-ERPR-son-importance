import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les séances d'un utilisateur avec sa progression
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 Utilisateur connecté:', user.id);

    // Récupérer les données complètes de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        sessions: {
          include: {
            professor: {
              select: {
                name: true,
                gender: true,
              }
            },
            cancellation: {
              include: {
                reason: true
              }
            }
          },
          orderBy: { scheduledAt: 'desc' }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    console.log('📚 Pages complétées par l\'utilisateur:', userData.completedPages);

    // Calculer la progression et les séances débloquées
    const completedPages = userData.completedPages || [];
    const filteredPages = completedPages.filter(p => p !== 0 && p !== 30);
    const maxPage = Math.max(...filteredPages, 0);
    
    console.log('📊 Pages filtrées:', filteredPages);
    console.log('📈 Page maximale atteinte:', maxPage);

    // Logique de déblocage des séances
    let unlockedSessions = 0;
    let nextUnlockPage: number | undefined;

    // Règles de déblocage corrigées
    if (maxPage >= 7) {
      unlockedSessions = 1;
      console.log('✅ 1ère séance débloquée (page 7 atteinte)');
      if (maxPage < 17) {
        nextUnlockPage = 17;
      }
    }
    if (maxPage >= 17) {
      unlockedSessions = 2;
      console.log('✅ 2ème séance débloquée (page 17 atteinte)');
      if (maxPage < 27) {
        nextUnlockPage = 27;
      }
    }
    if (maxPage >= 27) {
      unlockedSessions = 3;
      console.log('✅ 3ème séance débloquée (page 27 atteinte)');
    }

    console.log('🎯 Séances débloquées calculées:', unlockedSessions);
    console.log('🎯 Prochaine page de déblocage:', nextUnlockPage);

    const progress = {
      unlockedSessions,
      canBookSession: unlockedSessions > 0,
      nextUnlockPage
    };

    // Formater les séances
    const formattedSessions = userData.sessions.map(session => ({
      id: session.id,
      scheduledAt: session.scheduledAt.toISOString(),
      status: session.status,
      availabilityId: session.availabilityId,
      professor: session.professor,
      zoomLink: session.zoomLink,
      cancellation: session.cancellation ? {
        id: session.cancellation.id,
        cancelledBy: session.cancellation.cancelledBy,
        reason: session.cancellation.reason,
        customReason: session.cancellation.customReason,
        cancelledAt: session.cancellation.cancelledAt.toISOString(),
      } : undefined
    }));

    const responseData = {
      progress,
      sessions: formattedSessions,
      bookedSessionsCount: userData.sessions.filter(s => s.status !== 'CANCELLED').length
    };

    console.log('📤 Données de réponse:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Get user sessions error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
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

    const { slotId, availabilityId } = await request.json();

    if (!slotId || !availabilityId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    console.log('👤 Utilisateur connecté:', user.id);

    // Récupérer les données complètes de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        sessions: {
          include: {
            professor: {
              select: {
                name: true,
                gender: true,
              }
            },
            cancellation: {
              include: {
                reason: true
              }
            }
          },
          orderBy: { scheduledAt: 'desc' }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur peut réserver (progression suffisante)
    const completedPages = userData.completedPages || [];
    const filteredPages = completedPages.filter(p => p !== 0 && p !== 30);
    const maxPage = Math.max(...filteredPages, 0);
    
    if (maxPage < 7) {
      return NextResponse.json(
        { error: 'Vous devez atteindre la page 7 pour débloquer votre première séance' },
        { status: 400 }
      );
    }

    // Vérifier les limites de réservation
    const bookedSessionsCount = userData.sessions.length;
    let maxAllowedSessions = 0;
    
    if (maxPage >= 27) maxAllowedSessions = 3;
    else if (maxPage >= 17) maxAllowedSessions = 2;
    else if (maxPage >= 7) maxAllowedSessions = 1;

    if (bookedSessionsCount >= maxAllowedSessions) {
      return NextResponse.json(
        { error: 'Vous avez atteint votre limite de séances pour votre niveau de progression' },
        { status: 400 }
      );
    }

    // Récupérer la disponibilité
    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
      include: {
        professor: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            gender: true, 
            isActive: true,
            zoomMeetingId: true,
            zoomPassword: true
          }
        }
      }
    });

    if (!availability || !availability.isActive) {
      return NextResponse.json(
        { error: 'Créneau non disponible' },
        { status: 400 }
      );
    }

    const professor = availability.professor;
    if (!professor.isActive) {
      return NextResponse.json(
        { error: 'Professeur non disponible' },
        { status: 400 }
      );
    }

    console.log('📚 Pages complétées par l\'utilisateur:', userData.completedPages);

    // Calculer la progression et les séances débloquées
    const completedPages2 = userData.completedPages || [];
    const filteredPages2 = completedPages2.filter(p => p > 0 && p < 30);
    const maxPage2 = Math.max(...filteredPages2, 0);
    
    console.log('📊 Pages filtrées:', filteredPages2);
    console.log('📈 Page maximale atteinte:', maxPage2);

    // Logique de déblocage des séances
    let unlockedSessions = 0;
    let nextUnlockPage: number | undefined;

    // Règles de déblocage corrigées
    if (maxPage2 >= 7) {
      unlockedSessions = 1;
      console.log('✅ 1ère séance débloquée (page 7 atteinte)');
      if (maxPage2 < 17) {
        nextUnlockPage = 17;
      }
    }
    if (maxPage2 >= 17) {
      unlockedSessions = 2;
      console.log('✅ 2ème séance débloquée (page 17 atteinte)');
      if (maxPage2 < 27) {
        nextUnlockPage = 27;
      }
    }
    if (maxPage2 >= 27) {
      unlockedSessions = 3;
      console.log('✅ 3ème séance débloquée (page 27 atteinte)');
    }

    console.log('🎯 Séances débloquées calculées:', unlockedSessions);
    console.log('🎯 Prochaine page de déblocage:', nextUnlockPage);

    const progress = {
      unlockedSessions,
      canBookSession: unlockedSessions > 0,
      nextUnlockPage
    };

    // Formater les séances
    const formattedSessions = userData.sessions.map(session => ({
      id: session.id,
      scheduledAt: session.scheduledAt.toISOString(),
      status: session.status,
      availabilityId: session.availabilityId,
      professor: session.professor,
      zoomLink: session.zoomLink,
      cancellation: session.cancellation ? {
        id: session.cancellation.id,
        cancelledBy: session.cancellation.cancelledBy,
        reason: session.cancellation.reason,
        customReason: session.cancellation.customReason,
        cancelledAt: session.cancellation.cancelledAt.toISOString(),
      } : undefined
    }));

    const responseData = {
      progress,
      sessions: formattedSessions,
      bookedSessionsCount: userData.sessions.filter(s => s.status !== 'CANCELLED').length,
      success: true,
      session: {
        id: 'session.id',
        scheduledAt: 'session.scheduledAt.toISOString()',
        status: 'session.status',
        professor: 'session.professor',
      }
    };

    console.log('📤 Données de réponse:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Get user sessions error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    );
  }
}