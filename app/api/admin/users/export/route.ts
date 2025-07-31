import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const search = searchParams.get('search') || '';
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Construire les conditions de recherche
    const whereConditions: any = {};
    
    if (search) {
      whereConditions.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (!includeInactive) {
      whereConditions.isActive = true;
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
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
        resetToken: true,
        resetTokenExpires: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Enrichir les données utilisateur
    const enrichedUsers = users.map((user: { completedPages: { filter: (arg0: (p: number) => boolean) => { (): any; new(): any; length: any; }; }; completedQuizzes: { filter: (arg0: (q: number) => boolean) => { (): any; new(): any; length: any; }; }; id: any; email: any; username: any; gender: any; isActive: any; stripeCustomerId: any; stripeSessionId: any; studyTimeSeconds: number; resetToken: any; resetTokenExpires: { toISOString: () => any; }; createdAt: { toISOString: () => any; toLocaleDateString: (arg0: string) => any; }; updatedAt: { toISOString: () => any; toLocaleDateString: (arg0: string) => any; }; }) => {
      const completedPagesCount = user.completedPages.filter((p: number) => p !== 0 && p !== 30).length;
      const completedQuizzesCount = user.completedQuizzes.filter((q: number) => q !== 11).length;
      const totalPossibleItems = 29 + 11; // 29 pages + 11 quiz
      const progressPercentage = Math.round(
        ((completedPagesCount + completedQuizzesCount) / totalPossibleItems) * 100
      );

      return {
        id: user.id,
        email: user.email,
        username: user.username || '',
        gender: user.gender || '',
        isActive: user.isActive ? 'Oui' : 'Non',
        isPaid: user.stripeCustomerId ? 'Oui' : 'Non',
        stripeCustomerId: user.stripeCustomerId || '',
        stripeSessionId: user.stripeSessionId || '',
        completedPages: completedPagesCount,
        totalPages: 29,
        completedQuizzes: completedQuizzesCount,
        totalQuizzes: 11,
        progressPercentage,
        studyTimeFormatted: formatStudyTime(user.studyTimeSeconds),
        studyTimeSeconds: user.studyTimeSeconds,
        hasResetToken: user.resetToken ? 'Oui' : 'Non',
        resetTokenExpires: user.resetTokenExpires ? user.resetTokenExpires.toISOString() : '',
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        createdAtFormatted: user.createdAt.toLocaleDateString('fr-FR'),
        updatedAtFormatted: user.updatedAt.toLocaleDateString('fr-FR'),
      };
    });

    if (format === 'csv') {
      // Générer CSV avec toutes les données
      const headers = [
        'ID',
        'Email',
        'Pseudo',
        'Genre',
        'Compte Actif',
        'Utilisateur Payant',
        'ID Client Stripe',
        'ID Session Stripe',
        'Pages Complétées',
        'Total Pages',
        'Quiz Complétés',
        'Total Quiz',
        'Progression (%)',
        'Temps d\'Étude (Formaté)',
        'Temps d\'Étude (Secondes)',
        'Token de Réinitialisation',
        'Expiration Token',
        'Date d\'Inscription',
        'Dernière Activité',
        'Inscription (Formatée)',
        'Activité (Formatée)'
      ];

      const csvContent = [
        headers.join(','),
        ...enrichedUsers.map((user: { id: any; email: any; username: any; gender: any; isActive: any; isPaid: any; stripeCustomerId: any; stripeSessionId: any; completedPages: any; totalPages: any; completedQuizzes: any; totalQuizzes: any; progressPercentage: any; studyTimeFormatted: any; studyTimeSeconds: any; hasResetToken: any; resetTokenExpires: any; createdAt: any; updatedAt: any; createdAtFormatted: any; updatedAtFormatted: any; }) => [
          `"${user.id}"`,
          `"${user.email}"`,
          `"${user.username}"`,
          `"${user.gender}"`,
          `"${user.isActive}"`,
          `"${user.isPaid}"`,
          `"${user.stripeCustomerId}"`,
          `"${user.stripeSessionId}"`,
          user.completedPages,
          user.totalPages,
          user.completedQuizzes,
          user.totalQuizzes,
          user.progressPercentage,
          `"${user.studyTimeFormatted}"`,
          user.studyTimeSeconds,
          `"${user.hasResetToken}"`,
          `"${user.resetTokenExpires}"`,
          `"${user.createdAt}"`,
          `"${user.updatedAt}"`,
          `"${user.createdAtFormatted}"`,
          `"${user.updatedAtFormatted}"`
        ].join(','))
      ].join('\n');

      const fileName = `utilisateurs-methode-erpr-${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Format JSON par défaut avec métadonnées
    return NextResponse.json({
      users: enrichedUsers,
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCount: enrichedUsers.length,
        activeUsers: enrichedUsers.filter((u: { isActive: string; }) => u.isActive === 'Oui').length,
        paidUsers: enrichedUsers.filter((u: { isPaid: string; }) => u.isPaid === 'Oui').length,
        searchQuery: search,
        includeInactive,
        format
      },
      summary: {
        totalUsers: enrichedUsers.length,
        activeUsers: enrichedUsers.filter((u: { isActive: string; }) => u.isActive === 'Oui').length,
        paidUsers: enrichedUsers.filter((u: { isPaid: string; }) => u.isPaid === 'Oui').length,
        averageProgress: Math.round(
          enrichedUsers.reduce((sum: any, u: { progressPercentage: any; }) => sum + u.progressPercentage, 0) / enrichedUsers.length
        ),
        totalStudyTime: enrichedUsers.reduce((sum: any, u: { studyTimeSeconds: any; }) => sum + u.studyTimeSeconds, 0)
      }
    });
  } catch (error) {
    console.error('Export users error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des utilisateurs' },
      { status: 500 }
    );
  }
}

function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}min ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}min ${secs}s`;
  }
  return `${secs}s`;
}