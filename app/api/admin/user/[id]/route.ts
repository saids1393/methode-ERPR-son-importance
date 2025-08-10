import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendEmailChangeConfirmation, sendEmailChangeNotification } from '@/lib/email';
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

    // Enrichir les données
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
      isPaid: !!user.stripeCustomerId, // Statut payant basé sur stripeCustomerId
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

    // Récupérer l'utilisateur actuel pour comparer les changements
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { 
        email: true, 
        username: true, 
        gender: true, 
        isActive: true,
        stripeCustomerId: true // Ajouté ici pour corriger l'erreur
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
    let oldEmail = '';
    let newEmail = '';

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Gestion du statut payant manuel
    if (body.isPaid !== undefined) {
      if (body.isPaid && !currentUser.stripeCustomerId) {
        updateData.stripeCustomerId = `manual_${Date.now()}`;
        updateData.stripeSessionId = `manual_session_${Date.now()}`;
      } else if (!body.isPaid) {
        // Retirer le statut payant
        updateData.stripeCustomerId = null;
        updateData.stripeSessionId = null;
      }
    }

    if (body.email !== undefined && body.email !== currentUser.email) {
      if (!validateEmail(body.email)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide' },
          { status: 400 }
        );
      }

      // Vérifier l'unicité de l'email
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
      oldEmail = currentUser.email;
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

    // Envoyer les emails de confirmation si l'email a changé
    if (emailChanged) {
      try {
        // Email de confirmation à la nouvelle adresse
        await sendEmailChangeConfirmation(newEmail, user.username || undefined);
        
        // Email de notification à l'ancienne adresse
        await sendEmailChangeNotification(oldEmail, newEmail, user.username || undefined);
        
        console.log('✅ Emails de changement d\'email envoyés avec succès');
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi des emails de changement:', emailError);
        // Ne pas faire échouer la mise à jour pour une erreur d'email
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
