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
    console.log('📅 Réservation - slotId:', slotId, 'availabilityId:', availabilityId);

    // Récupérer les données complètes de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        completedPages: true,
        sessions: {
          where: { status: { not: 'CANCELLED' } },
          select: { id: true }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!userData.gender) {
      return NextResponse.json(
        { error: 'Genre non défini dans le profil' },
        { status: 400 }
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

    if (professor.gender !== userData.gender) {
      return NextResponse.json(
        { error: 'Genre du professeur incompatible' },
        { status: 400 }
      );
    }

    // Extraire la date du slotId
    const datePart = slotId.split('_')[1];
    if (!datePart) {
      return NextResponse.json(
        { error: 'Format de créneau invalide' },
        { status: 400 }
      );
    }

    // Construire la date/heure complète
    const scheduledAt = new Date(`${datePart}T${availability.startTime}:00`);
    
    console.log('📅 Date programmée calculée:', scheduledAt);

    // Vérifier que la date est dans le futur
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible' },
        { status: 400 }
      );
    }

    // Vérifier que le créneau n'est pas déjà réservé
    const existingSession = await prisma.session.findFirst({
      where: {
        professorId: professor.id,
        scheduledAt: scheduledAt,
        status: 'SCHEDULED'
      }
    });

    if (existingSession) {
      return NextResponse.json(
        { error: 'Ce créneau vient d\'être réservé par un autre élève' },
        { status: 400 }
      );
    }

    // Vérifier l'espacement de 2 jours
    const twoDaysAgo = new Date(scheduledAt.getTime() - 2 * 24 * 60 * 60 * 1000);
    const twoDaysLater = new Date(scheduledAt.getTime() + 2 * 24 * 60 * 60 * 1000);

    const conflictingSessions = await prisma.session.count({
      where: {
        userId: user.id,
        scheduledAt: {
          gte: twoDaysAgo,
          lte: twoDaysLater
        },
        status: { not: 'CANCELLED' }
      }
    });

    if (conflictingSessions > 0) {
      return NextResponse.json(
        { error: 'Les séances doivent être espacées d\'au moins 2 jours' },
        { status: 400 }
      );
    }

    // Générer le lien Zoom
    let zoomLink: string | null = null;
    if (professor.zoomMeetingId) {
      zoomLink = `https://zoom.us/j/${professor.zoomMeetingId}`;
      if (professor.zoomPassword) {
        zoomLink += `?pwd=${professor.zoomPassword}`;
      }
    }
    
    console.log('🔗 Lien Zoom généré:', zoomLink);

    // Créer la séance
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        professorId: professor.id,
        availabilityId,
        scheduledAt,
        zoomLink: zoomLink,
        status: 'SCHEDULED'
      },
      include: {
        professor: {
          select: {
            name: true,
            gender: true,
          }
        }
      }
    });

    console.log('✅ Séance créée avec succès:', session.id);

    // Associer l'utilisateur au professeur si pas déjà fait
    await prisma.user.update({
      where: { id: user.id },
      data: { professorId: professor.id }
    });

    console.log('🔗 Utilisateur associé au professeur');

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        scheduledAt: session.scheduledAt.toISOString(),
        status: session.status,
        professor: session.professor,
        zoomLink: session.zoomLink,
        availabilityId: session.availabilityId
      },
      message: 'Séance réservée avec succès'
    });
  } catch (error) {
    console.error('Book session error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    );
  }
}