import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeInput } from '@/lib/security';

// POST - Annuler une séance
export async function POST(request: NextRequest) {
  try {
    const { sessionId, customReason, cancelledBy } = await request.json();

    if (!sessionId || !customReason || !cancelledBy) {
      return NextResponse.json(
        { error: 'Session ID, motif et type d\'utilisateur requis' },
        { status: 400 }
      );
    }

    let userId: string;
    let userRole: 'STUDENT' | 'PROFESSOR';

    if (cancelledBy === 'STUDENT') {
      const user = await getAuthUserFromRequest(request);
      if (!user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
      userId = user.id;
      userRole = 'STUDENT';
    } else if (cancelledBy === 'PROFESSOR') {
      const token = request.cookies.get('professor-token')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: { select: { id: true, email: true, username: true } },
        professor: { select: { id: true, name: true, email: true } }
      }
    });

    if (!session) {
      return NextResponse.json({ error: 'Séance non trouvée' }, { status: 404 });
    }

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

    if (session.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Cette séance ne peut plus être annulée' },
        { status: 400 }
      );
    }

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

    const cleanCustomReason = sanitizeInput(customReason);
    if (cleanCustomReason.length < 10) {
      return NextResponse.json(
        { error: 'Le motif doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    // ✅ (Optionnel) Vérifie que le CancellationReason "custom" existe
    const reasonExists = await prisma.cancellationReason.findUnique({
      where: { id: 'custom' }
    });

    if (!reasonExists) {
      return NextResponse.json(
        { error: 'Le motif "custom" n\'existe pas dans la base de données' },
        { status: 500 }
      );
    }

    // Transaction
    const result = await prisma.$transaction(async (tx) => {
      const cancellation = await tx.sessionCancellation.create({
        data: {
          sessionId,
          cancelledBy: userRole,
          reasonId: 'custom',
          customReason: cleanCustomReason,
        }
      });

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
