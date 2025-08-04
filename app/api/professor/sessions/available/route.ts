import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les créneaux disponibles pour un élève
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les données de l'utilisateur
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { gender: true }
    });

    if (!userData?.gender) {
      return NextResponse.json(
        { error: 'Genre non défini dans le profil' },
        { status: 400 }
      );
    }

    // Récupérer les professeurs du même genre
    const professors = await prisma.professor.findMany({
      where: {
        gender: userData.gender,
        isActive: true
      },
      select: { id: true }
    });

    const professorIds = professors.map(p => p.id);

    if (professorIds.length === 0) {
      return NextResponse.json({
        availableSlots: [],
        message: 'Aucun professeur disponible pour votre genre'
      });
    }

    // Récupérer les disponibilités actives
    const availabilities = await prisma.availability.findMany({
      where: {
        professorId: { in: professorIds },
        isActive: true
      },
      include: {
        professor: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
          }
        },
        _count: {
          select: {
            sessions: {
              where: {
                status: 'SCHEDULED'
              }
            }
          }
        }
      }
    });

    // Générer les créneaux disponibles pour les 30 prochains jours
    const availableSlots = [];
    const today = new Date();
    const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const availability of availabilities) {
      // Vérifier si le créneau n'est pas complet
      if (availability._count.sessions >= availability.maxSessions) {
        continue;
      }

      if (availability.isRecurring) {
        // Créneaux récurrents
        for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
          if (date.getDay() === availability.dayOfWeek && date > today) {
            // Vérifier qu'il n'y a pas déjà une séance réservée à cette date/heure
            const existingSession = await prisma.session.findFirst({
              where: {
                professorId: availability.professorId,
                scheduledAt: {
                  gte: new Date(date.toDateString() + ' ' + availability.startTime),
                  lt: new Date(date.toDateString() + ' ' + availability.endTime)
                },
                status: 'SCHEDULED'
              }
            });

            if (!existingSession) {
              availableSlots.push({
                id: `${availability.id}_${date.toISOString().split('T')[0]}`,
                availabilityId: availability.id,
                professor: availability.professor,
                date: date.toISOString().split('T')[0],
                startTime: availability.startTime,
                endTime: availability.endTime,
                dayOfWeek: availability.dayOfWeek,
                scheduledAt: new Date(date.toDateString() + ' ' + availability.startTime).toISOString()
              });
            }
          }
        }
      } else if (availability.specificDate) {
        // Créneau ponctuel
        const specificDate = new Date(availability.specificDate);
        if (specificDate > today && specificDate <= endDate) {
          const existingSession = await prisma.session.findFirst({
            where: {
              professorId: availability.professorId,
              scheduledAt: {
                gte: new Date(specificDate.toDateString() + ' ' + availability.startTime),
                lt: new Date(specificDate.toDateString() + ' ' + availability.endTime)
              },
              status: 'SCHEDULED'
            }
          });

          if (!existingSession) {
            availableSlots.push({
              id: `${availability.id}_${specificDate.toISOString().split('T')[0]}`,
              availabilityId: availability.id,
              professor: availability.professor,
              date: specificDate.toISOString().split('T')[0],
              startTime: availability.startTime,
              endTime: availability.endTime,
              dayOfWeek: specificDate.getDay(),
              scheduledAt: new Date(specificDate.toDateString() + ' ' + availability.startTime).toISOString(),
              isSpecific: true
            });
          }
        }
      }
    }

    // Trier par date puis par heure
    availableSlots.sort((a, b) => {
      const dateCompare = new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });

    return NextResponse.json({
      availableSlots: availableSlots.slice(0, 50), // Limiter à 50 créneaux
      totalSlots: availableSlots.length
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}