import { prisma } from './prisma';
import { getAuthUserFromRequest } from './auth';
import { NextRequest } from 'next/server';

export interface SessionData {
  id: string;
  userId: string;
  professorId: string;
  scheduledAt: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  zoomLink?: string;
  notes?: string;
  availabilityId?: string;
  cancellation?: {
    id: string;
    cancelledBy: string;
    reason: {
      reason: string;
      category: string;
    };
    customReason?: string;
    cancelledAt: Date;
  };
  professor: {
    name: string;
    email: string;
    gender: 'HOMME' | 'FEMME';
  };
}

export interface StudentProgress {
  completedPages: number[];
  unlockedSessions: number;
  canBookSession: boolean;
  nextUnlockPage?: number;
}

// Calculer les séances débloquées selon la progression
export function calculateUnlockedSessions(completedPages: number[]): StudentProgress {
  const filteredPages = completedPages.filter(p => p !== 0 && p !== 30);
  const maxPage = Math.max(...filteredPages, 0);
  
  let unlockedSessions = 0;
  let nextUnlockPage: number | undefined;

  // Règles de déblocage
  if (maxPage >= 7) {
    unlockedSessions = 1;
    if (maxPage < 17) nextUnlockPage = 17;
  }
  if (maxPage >= 17) {
    unlockedSessions = 2;
    if (maxPage < 27) nextUnlockPage = 27;
  }
  if (maxPage >= 27) {
    unlockedSessions = 3;
  }

  return {
    completedPages: filteredPages,
    unlockedSessions,
    canBookSession: unlockedSessions > 0,
    nextUnlockPage
  };
}

// Obtenir les séances d'un utilisateur
export async function getUserSessions(userId: string): Promise<SessionData[]> {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId },
      include: {
        professor: {
          select: {
            name: true,
            email: true,
            gender: true,
          }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      professorId: session.professorId,
      scheduledAt: session.scheduledAt,
      status: session.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
      zoomLink: session.zoomLink || undefined,
      notes: session.notes || undefined,
      professor: session.professor
    }));
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
}

// Réserver une séance à partir d'un créneau disponible
export async function bookSessionFromSlot(
  userId: string,
  availabilityId: string,
  slotId: string,
  userGender: 'HOMME' | 'FEMME'
): Promise<{ success: boolean; error?: string; session?: SessionData }> {
  try {
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
      return { success: false, error: 'Créneau non disponible' };
    }

    const professor = availability.professor;
    if (!professor.isActive) {
      return { success: false, error: 'Professeur non disponible' };
    }

    if (professor.gender !== userGender) {
      return { success: false, error: 'Genre du professeur incompatible' };
    }

    // Extraire la date du slotId
    const datePart = slotId.split('_')[1];
    if (!datePart) {
      return { success: false, error: 'Format de créneau invalide' };
    }

    // Construire la date/heure complète
    const scheduledAt = new Date(`${datePart}T${availability.startTime}:00`);
    
    // Vérifier que la date est dans le futur
    if (scheduledAt <= new Date()) {
      return { success: false, error: 'Ce créneau n\'est plus disponible' };
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
      return { success: false, error: 'Ce créneau vient d\'être réservé par un autre élève' };
    }

    // Vérifier les contraintes de l'utilisateur
    const existingSessions = await prisma.session.count({
      where: { userId }
    });

    if (existingSessions >= 3) {
      return { success: false, error: 'Limite de 3 séances atteinte' };
    }

    // Vérifier l'espacement de 2 jours
    const twoDaysAgo = new Date(scheduledAt.getTime() - 2 * 24 * 60 * 60 * 1000);
    const twoDaysLater = new Date(scheduledAt.getTime() + 2 * 24 * 60 * 60 * 1000);

    const conflictingSessions = await prisma.session.count({
      where: {
        userId,
        scheduledAt: {
          gte: twoDaysAgo,
          lte: twoDaysLater
        },
        status: { not: 'CANCELLED' }
      }
    });

    if (conflictingSessions > 0) {
      return { success: false, error: 'Les séances doivent être espacées d\'au moins 2 jours' };
    }

    // Générer le lien Zoom
    let zoomLink: string | null = null;
    if (professor.zoomMeetingId) {
      zoomLink = `https://zoom.us/j/${professor.zoomMeetingId}`;
      if (professor.zoomPassword) {
        zoomLink += `?pwd=${professor.zoomPassword}`;
      }
    }
    
    // Créer la séance
    const session = await prisma.session.create({
      data: {
        userId,
        professorId: professor.id,
        availabilityId,
        scheduledAt,
        zoomLink: zoomLink,
      },
      include: {
        professor: {
          select: {
            name: true,
            email: true,
            gender: true,
          }
        }
      }
    });

    // Associer l'utilisateur au professeur
    await prisma.user.update({
      where: { id: userId },
      data: { professorId: professor.id }
    });

    return {
      success: true,
      session: {
        id: session.id,
        userId: session.userId,
        professorId: session.professorId,
        scheduledAt: session.scheduledAt,
        status: session.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
        zoomLink: session.zoomLink || undefined,
        notes: session.notes || undefined,
        availabilityId: session.availabilityId || undefined,
        professor: session.professor
      }
    };
  } catch (error) {
    console.error('Error booking session from slot:', error);
    return { success: false, error: 'Erreur lors de la réservation' };
  }
}

// Réserver une séance (ancienne fonction pour compatibilité)
export async function bookSession(
  userId: string,
  professorId: string,
  scheduledAt: Date,
  userGender: 'HOMME' | 'FEMME'
): Promise<{ success: boolean; error?: string; session?: SessionData }> {
  try {
    // Vérifier que le professeur existe et a le bon genre
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        gender: true, 
        isActive: true,
        zoomMeetingId: true,
        zoomPassword: true
      }
    });

    if (!professor || !professor.isActive) {
      return { success: false, error: 'Professeur non disponible' };
    }

    if (professor.gender !== userGender) {
      return { success: false, error: 'Genre du professeur incompatible' };
    }

    // Vérifier les contraintes de réservation
    const existingSessions = await prisma.session.count({
      where: { userId }
    });

    if (existingSessions >= 3) {
      return { success: false, error: 'Limite de 3 séances atteinte' };
    }

    // Vérifier l'espacement de 2 jours
    const twoDaysAgo = new Date(scheduledAt.getTime() - 2 * 24 * 60 * 60 * 1000);
    const twoDaysLater = new Date(scheduledAt.getTime() + 2 * 24 * 60 * 60 * 1000);

    const conflictingSessions = await prisma.session.count({
      where: {
        userId,
        scheduledAt: {
          gte: twoDaysAgo,
          lte: twoDaysLater
        },
        status: { not: 'CANCELLED' }
      }
    });

    if (conflictingSessions > 0) {
      return { success: false, error: 'Les séances doivent être espacées d\'au moins 2 jours' };
    }

    // Générer le lien Zoom personnalisé du professeur
    let zoomLink: string | null = null;
    if (professor.zoomMeetingId) {
      zoomLink = `https://zoom.us/j/${professor.zoomMeetingId}`;
      if (professor.zoomPassword) {
        zoomLink += `?pwd=${professor.zoomPassword}`;
      }
    } else {
      // Pas de lien si pas d'ID configuré
      zoomLink = null;
    }
    
    // Créer la séance
    const session = await prisma.session.create({
      data: {
        userId,
        professorId,
        scheduledAt,
        zoomLink: zoomLink,
      },
      include: {
        professor: {
          select: {
            name: true,
            email: true,
            gender: true,
          }
        }
      }
    });

    // Associer l'utilisateur au professeur
    await prisma.user.update({
      where: { id: userId },
      data: { professorId }
    });

    return {
      success: true,
      session: {
        id: session.id,
        userId: session.userId,
        professorId: session.professorId,
        scheduledAt: session.scheduledAt,
        status: session.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
        zoomLink: session.zoomLink || undefined,
        notes: session.notes || undefined,
        availabilityId: session.availabilityId || undefined,
        professor: session.professor
      }
    };
  } catch (error) {
    console.error('Error booking session:', error);
    return { success: false, error: 'Erreur lors de la réservation' };
  }
}

// Obtenir les élèves d'un professeur (filtré par genre et réservations)
export async function getProfessorStudents(professorId: string) {
  try {
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      select: { gender: true }
    });

    if (!professor) {
      return [];
    }

    // Récupérer uniquement les élèves qui ont réservé avec ce professeur
    // ET qui ont le même genre
    const students = await prisma.user.findMany({
      where: {
        professorId: professorId,
        gender: professor.gender,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        createdAt: true,
        sessions: {
          where: { professorId },
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            zoomLink: true,
            notes: true,
            availabilityId: true,
            cancellation: {
              select: {
                id: true,
                cancelledBy: true,
                reason: true,
                customReason: true,
                cancelledAt: true,
              }
            }
          },
          orderBy: { scheduledAt: 'desc' }
        }
      }
    });

    return students.map(student => {
      const completedPagesCount = student.completedPages.filter(p => p !== 0 && p !== 30).length;
      const completedQuizzesCount = student.completedQuizzes.filter(q => q !== 11).length;
      const totalPossibleItems = 29 + 11;
      const progressPercentage = Math.round(
        ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
      );

      return {
        id: student.id,
        email: student.email,
        username: student.username,
        gender: student.gender,
        completedPagesCount,
        completedQuizzesCount,
        progressPercentage,
        studyTimeMinutes: Math.round(student.studyTimeSeconds / 60),
        sessions: student.sessions.map(session => ({
          ...session,
          isPast: session.scheduledAt < new Date(),
          statusText: session.scheduledAt < new Date() ? 'passée' : 'à venir',
          availabilityId: session.availabilityId || undefined,
          cancellation: session.cancellation ? {
            id: session.cancellation.id,
            cancelledBy: session.cancellation.cancelledBy,
            reason: session.cancellation.reason,
            customReason: session.cancellation.customReason || undefined,
            cancelledAt: session.cancellation.cancelledAt,
          } : undefined,
        }))
      };
    });
  } catch (error) {
    console.error('Error fetching professor students:', error);
    return [];
  }
}