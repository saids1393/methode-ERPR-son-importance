import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateUsername } from '@/lib/security';

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
      isPaid: user.isActive, // Tous les utilisateurs actifs sont considérés comme payants
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

    const updateData: any = {};

    // Validation et mise à jour des champs autorisés
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    if (body.username !== undefined) {
      if (body.username === '') {
        updateData.username = null;
      } else {
        const usernameValidation = validateUsername(body.username);
        if (!usernameValidation.valid) {
          return NextResponse.json(
            { error: usernameValidation.errors[0] },
            { status: 400 }
          );
        }

        // Vérifier l'unicité du username
        const existingUser = await prisma.user.findUnique({
          where: { username: body.username }
        });

        if (existingUser && existingUser.id !== id) {
          return NextResponse.json(
            { error: 'Ce pseudo est déjà utilisé' },
            { status: 400 }
          );
        }

        updateData.username = body.username;
      }
    }

    if (body.email !== undefined) {
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

      updateData.email = body.email;
    }

    if (body.password !== undefined && body.password !== '') {
      const passwordValidation = validatePassword(body.password);
      if (!passwordValidation.valid) {
        return NextResponse.json(
          { error: passwordValidation.errors[0] },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(body.password, 12);
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

    // Gestion du statut payant
    if (body.isPaid !== undefined) {
      if (body.isPaid && !updateData.stripeCustomerId) {
        updateData.stripeCustomerId = `cus_admin_${Date.now()}`;
        updateData.stripeSessionId = `cs_admin_${Date.now()}`;
      } else if (!body.isPaid) {
        updateData.stripeCustomerId = null;
        updateData.stripeSessionId = null;
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

    // Enrichir les données de retour
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
      isPaid: user.isActive, // Tous les utilisateurs actifs sont considérés comme payants
      studyTimeFormatted: formatStudyTime(user.studyTimeSeconds)
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
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