import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmailChangeConfirmation } from '@/lib/email';
import { validateEmail } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        stripeCustomerId: true,
        stripeSessionId: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Progression calculée
    const completedPagesCount = user.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
    const completedQuizzesCount = user.completedQuizzes.filter((q: number) => q !== 11).length;
    const totalPossibleItems = 29 + 11;
    const progressPercentage = Math.round(
      ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
    );

    return NextResponse.json({
      ...user,
      completedPagesCount,
      completedQuizzesCount,
      progressPercentage,
      isPaid: !!user.stripeCustomerId,
      studyTimeFormatted: formatStudyTime(user.studyTimeSeconds)
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json(
      { error: 'Accès non autorisé' },
      { status: 403 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { 
        email: true, 
        username: true, 
        gender: true, 
        isActive: true,
        stripeCustomerId: true
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const allowedFields = ['isActive', 'username'];
    const updateData: any = {};
    let emailChanged = false;
    let newEmail = '';

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Statut payant manuel
    if (body.isPaid !== undefined) {
      if (body.isPaid && !currentUser.stripeCustomerId) {
        updateData.stripeCustomerId = `manual_${Date.now()}`;
        updateData.stripeSessionId = `manual_session_${Date.now()}`;
      } else if (!body.isPaid) {
        updateData.stripeCustomerId = null;
        updateData.stripeSessionId = null;
      }
    }

    // Vérification email
    if (body.email !== undefined && body.email !== currentUser.email) {
      if (!validateEmail(body.email)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }

      emailChanged = true;
      newEmail = body.email;
      updateData.email = body.email;
    }

    if (body.gender !== undefined) {
      if (body.gender === '') {
        updateData.gender = null;
      } else if (['HOMME', 'FEMME'].includes(body.gender)) {
        updateData.gender = body.gender;
      } else {
        return NextResponse.json(
          { error: 'Genre invalide' },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        gender: true,
        isActive: true,
        stripeCustomerId: true,
        completedPages: true,
        completedQuizzes: true,
        studyTimeSeconds: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Envoi confirmation si email changé
    if (emailChanged) {
      try {
        // Générer le lien de confirmation
        const token = 'token_de_confirmation'; // TODO : générer un vrai token sécurisé
        const confirmationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/confirm-email?token=${token}`;

        await sendEmailChangeConfirmation(currentUser.email, newEmail, confirmationUrl);
        console.log('✅ Email de confirmation envoyé');
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de la confirmation email:', emailError);
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  }
  return `${secs}s`;
}
