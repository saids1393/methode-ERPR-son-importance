import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Liste d\'IDs utilisateur requise' },
        { status: 400 }
      );
    }

    // Limiter le nombre d'utilisateurs supprimés en une fois
    if (userIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 utilisateurs peuvent être supprimés en une fois' },
        { status: 400 }
      );
    }

    // Vérifier que les utilisateurs existent
    const existingUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true, isActive: true }
    });

    if (existingUsers.length !== userIds.length) {
      return NextResponse.json(
        { error: 'Certains utilisateurs n\'existent pas' },
        { status: 400 }
      );
    }

    // Empêcher la suppression d'utilisateurs admin (optionnel)
    const adminEmails = [process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com'];
    const adminUsers = existingUsers.filter((user: { email: string; }) => adminEmails.includes(user.email));
    
    if (adminUsers.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer des comptes administrateur' },
        { status: 403 }
      );
    }

    // Supprimer les utilisateurs
    const deleteResult = await prisma.user.deleteMany({
      where: { id: { in: userIds } }
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `${deleteResult.count} utilisateur(s) supprimé(s) avec succès`,
      deletedUsers: existingUsers.map((u: { id: any; email: any; }) => ({ id: u.id, email: u.email }))
    });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression en masse' },
      { status: 500 }
    );
  }
}