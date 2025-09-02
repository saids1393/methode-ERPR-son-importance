import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// GET - Exporter les envois de devoirs en CSV
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const format = searchParams.get('format') || 'csv';

    // Construire les conditions de recherche
    const whereConditions: any = {};
    if (chapterId) {
      whereConditions.homework = { chapterId: parseInt(chapterId) };
    }
    if (status === 'success') {
      whereConditions.emailSent = true;
    } else if (status === 'failed') {
      whereConditions.emailSent = false;
    }
    if (search) {
      whereConditions.user = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const sends = await prisma.homeworkSend.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            gender: true,
            completedPages: true,
            completedQuizzes: true,
            studyTimeSeconds: true,
            createdAt: true,
            isActive: true,
            stripeCustomerId: true
          }
        },
        homework: {
          select: {
            id: true,
            chapterId: true,
            title: true,
            content: true,
            createdAt: true
          }
        }
      },
      orderBy: { sentAt: 'desc' }
    });

    if (format === 'csv') {
      const headers = [
        'ID Envoi',
        'Date Envoi',
        'Statut Email',
        'ID Utilisateur',
        'Email Utilisateur',
        'Pseudo Utilisateur',
        'Genre Utilisateur',
        'Utilisateur Actif',
        'Utilisateur Payant',
        'Pages Complétées',
        'Quiz Complétés',
        'Temps Étude (min)',
        'Date Inscription',
        'ID Devoir',
        'Chapitre',
        'Titre Devoir',
        'Date Création Devoir'
      ];

      const csvContent = [
        headers.join(','),
        ...sends.map(send => {
          const completedPagesCount = send.user.completedPages.filter(p => p !== 0 && p !== 30).length;
          const completedQuizzesCount = send.user.completedQuizzes.filter(q => q !== 11).length;
          const studyTimeMinutes = Math.round(send.user.studyTimeSeconds / 60);
          
          return [
            `"${send.id}"`,
            `"${send.sentAt.toISOString()}"`,
            `"${send.emailSent ? 'Réussi' : 'Échec'}"`,
            `"${send.user.id}"`,
            `"${send.user.email}"`,
            `"${send.user.username || 'Sans pseudo'}"`,
            `"${send.user.gender || 'Non spécifié'}"`,
            `"${send.user.isActive ? 'Oui' : 'Non'}"`,
            `"${send.user.stripeCustomerId ? 'Oui' : 'Non'}"`,
            completedPagesCount,
            completedQuizzesCount,
            studyTimeMinutes,
            `"${send.user.createdAt.toISOString()}"`,
            `"${send.homework.id}"`,
            send.homework.chapterId,
            `"${send.homework.title}"`,
            `"${send.homework.createdAt.toISOString()}"`
          ].join(',');
        })
      ].join('\n');

      const fileName = `envois-devoirs-${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-cache'
        }
      });
    }

    // Format JSON par défaut
    return NextResponse.json({
      sends: sends.map(send => ({
        id: send.id,
        sentAt: send.sentAt.toISOString(),
        emailSent: send.emailSent,
        user: {
          ...send.user,
          completedPagesCount: send.user.completedPages.filter(p => p !== 0 && p !== 30).length,
          completedQuizzesCount: send.user.completedQuizzes.filter(q => q !== 11).length,
          studyTimeMinutes: Math.round(send.user.studyTimeSeconds / 60),
          isPaid: !!send.user.stripeCustomerId
        },
        homework: send.homework
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCount: sends.length,
        filters: { chapterId, status, search }
      }
    });
  } catch (error) {
    console.error('Export homework sends error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des envois' },
      { status: 500 }
    );
  }
}