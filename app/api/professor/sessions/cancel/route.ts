import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeInput } from '@/lib/security';

// POST - Annuler une séance
export async function POST(request: NextRequest) {
  try {
    const { sessionId, reasonId, customReason, cancelledBy } = await request.json();

    if (!sessionId || !reasonId || !cancelledBy) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    let userId: string;
    let userRole: 'STUDENT' | 'PROFESSOR';

    // Vérifier l'authentification selon le type d'utilisateur
    if (cancelledBy === 'STUDENT') {
      const user = await getAuthUserFromRequest(request);
      if (!user) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        );
      }
      userId = user.id;
      userRole = 'STUDENT';
    } else if (cancelledBy === 'PROFESSOR') {
      const token = request.cookies.get('professor-token')?.value;
      if (!token) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        );
      }
      const decoded = await verifyToken(token);
      userId = decoded.userId;
      userRole = 'PROFESSOR';
    } else {
      return NextResponse.json(
        { error: 'Type d\'utilisateur invalide' },
        { status: 400 }
      );
    }

    // Vérifier que la séance existe et appartient à l'utilisateur
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: { select: { id: true, email: true, username: true } },
        professor: { select: { id: true, name: true, email: true } }
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Séance non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (userRole === 'STUDENT' && session.userId !== userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez annuler que vos propres séances' },
        { status: 403 }
      );
    }

    if (userRole === 'PROFESSOR' && session.professorId !== userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez annuler que vos propres séances' },
        { status: 403 }
      );
    }

    // Vérifier que la séance peut être annulée
    if (session.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Cette séance ne peut plus être annulée' },
        { status: 400 }
      );
    }

    // Vérifier le délai d'annulation (24h avant)
    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const timeDiff = sessionTime.getTime() - now.getTime();
    const hoursUntilSession = timeDiff / (1000 * 60 * 60);

    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { error: 'Les annulations doivent être effectuées au moins 24h avant la séance' },
        { status: 400 }
      );
    }

    // Vérifier que le motif existe
    const reason = await prisma.cancellationReason.findUnique({
      where: { id: reasonId }
    });

    if (!reason) {
      return NextResponse.json(
        { error: 'Motif d\'annulation invalide' },
        { status: 400 }
      );
    }

    // Transaction pour annuler la séance
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'enregistrement d'annulation
      const cancellation = await tx.sessionCancellation.create({
        data: {
          sessionId,
          cancelledBy: userRole,
          reasonId,
          customReason: customReason ? sanitizeInput(customReason) : null,
        }
      });

      // Mettre à jour le statut de la séance
      const updatedSession = await tx.session.update({
        where: { id: sessionId },
        data: {
          status: 'CANCELLED',
          cancellationId: cancellation.id
        },
        include: {
          user: { select: { email: true, username: true } },
          professor: { select: { name: true, email: true } },
          cancellation: {
            include: { reason: true }
          }
        }
      });

      return { cancellation, session: updatedSession };
    });

    // TODO: Envoyer des emails de notification d'annulation
    // await sendCancellationNotification(result.session, userRole);

    return NextResponse.json({
      success: true,
      message: 'Séance annulée avec succès',
      cancellation: result.cancellation
    });
  } catch (error) {
    console.error('Cancel session error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation' },
      { status: 500 }
    );
  }
}