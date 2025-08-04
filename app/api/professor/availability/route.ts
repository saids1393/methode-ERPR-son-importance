import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeInput } from '@/lib/security';

// GET - Récupérer les disponibilités d'un professeur
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
    const professorId = decoded.userId;

    const availabilities = await prisma.availability.findMany({
      where: { 
        professorId,
        isActive: true 
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json({ availabilities });
  } catch (error) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle disponibilité
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const professorId = decoded.userId;

    const { dayOfWeek, startTime, endTime, isRecurring, specificDate, maxSessions } = await request.json();

    // Validations
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { error: 'Jour de la semaine invalide (0-6)' },
        { status: 400 }
      );
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: 'Heure de début et fin requises' },
        { status: 400 }
      );
    }

    // Vérifier le format HH:MM
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Format d\'heure invalide (HH:MM)' },
        { status: 400 }
      );
    }

    // Vérifier que l'heure de fin est après l'heure de début
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { error: 'L\'heure de fin doit être après l\'heure de début' },
        { status: 400 }
      );
    }

    // Vérifier que la durée ne dépasse pas 1 heure
    const durationMinutes = endMinutes - startMinutes;
    if (durationMinutes > 60) {
      return NextResponse.json(
        { error: 'La durée d\'un créneau ne peut pas dépasser 1 heure' },
        { status: 400 }
      );
    }

    if (durationMinutes < 30) {
      return NextResponse.json(
        { error: 'La durée d\'un créneau doit être d\'au moins 30 minutes' },
        { status: 400 }
      );
    }

    // Vérifier les conflits avec les disponibilités existantes
    const conflictingAvailability = await prisma.availability.findFirst({
      where: {
        professorId,
        dayOfWeek,
        isActive: true,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAvailability) {
      return NextResponse.json(
        { error: 'Ce créneau entre en conflit avec une disponibilité existante' },
        { status: 400 }
      );
    }

    // Créer la disponibilité
    const availability = await prisma.availability.create({
      data: {
        professorId,
        dayOfWeek,
        startTime: sanitizeInput(startTime),
        endTime: sanitizeInput(endTime),
        isRecurring: isRecurring ?? true,
        specificDate: specificDate ? new Date(specificDate) : null,
        maxSessions: 1, // Toujours 1 séance par créneau
      }
    });

    return NextResponse.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Create availability error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une disponibilité
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('professor-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    const professorId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const availabilityId = searchParams.get('id');

    if (!availabilityId) {
      return NextResponse.json(
        { error: 'ID de disponibilité requis' },
        { status: 400 }
      );
    }

    // Vérifier que la disponibilité appartient au professeur
    const availability = await prisma.availability.findFirst({
      where: {
        id: availabilityId,
        professorId
      }
    });

    if (!availability) {
      return NextResponse.json(
        { error: 'Disponibilité non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier s'il y a des séances réservées sur cette disponibilité
    const bookedSessions = await prisma.session.count({
      where: {
        availabilityId,
        status: 'SCHEDULED'
      }
    });

    if (bookedSessions > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer : des séances sont déjà réservées sur ce créneau' },
        { status: 400 }
      );
    }

    // Marquer comme inactif plutôt que supprimer
    await prisma.availability.update({
      where: { id: availabilityId },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete availability error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}