import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkAndSendHomework } from '@/lib/homework-email';
import { prisma } from '@/lib/prisma';

// POST - Envoyer un devoir automatiquement quand un chapitre est complété
export async function POST(request: NextRequest) {
  try {
    console.log('📧 [API] ===== DÉBUT ENVOI DEVOIR =====');
    
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      console.log('❌ [API] Utilisateur non authentifié');
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    console.log('👤 [API] Utilisateur authentifié:', user.id);

    const { chapterNumber } = await request.json();
    
    if (typeof chapterNumber !== 'number' || chapterNumber < 1 || chapterNumber > 10) {
      console.log('❌ [API] Numéro de chapitre invalide:', chapterNumber);
      return NextResponse.json(
        { error: 'Numéro de chapitre invalide (1-10)' },
        { status: 400 }
      );
    }

    console.log('📚 [API] Tentative d\'envoi devoir pour chapitre:', chapterNumber);

    // Utiliser la fonction de la lib pour vérifier et envoyer
    const sent = await checkAndSendHomework(user.id, chapterNumber);
    
    console.log('📧 [API] Résultat envoi devoir:', sent);
    console.log('📧 [API] ===== FIN ENVOI DEVOIR =====');

    return NextResponse.json({
      success: true,
      sent,
      message: sent 
        ? `Devoir du chapitre ${chapterNumber} envoyé avec succès`
        : `Devoir du chapitre ${chapterNumber} non envoyé (déjà envoyé ou inexistant)`
    });
  } catch (error) {
    console.error('❌ [API] Erreur envoi devoir:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du devoir' },
      { status: 500 }
    );
  }
}

// GET - Récupérer tous les envois de devoirs avec détails
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si c'est un admin pour accéder à tous les envois
    const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || 'soidroudinesaid51@gmail.com'];
    const isAdmin = ADMIN_EMAILS.includes(user.email);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Accès administrateur requis' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const chapterId = searchParams.get('chapterId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construire les conditions de recherche
    const whereConditions: any = {};
    if (chapterId) {
      whereConditions.homework = { chapterId: parseInt(chapterId) };
    }
    if (userId) {
      whereConditions.userId = userId;
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

    const [sends, totalCount, stats] = await Promise.all([
      prisma.homeworkSend.findMany({
        where: whereConditions,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              gender: true
            }
          },
          homework: {
            select: {
              id: true,
              chapterId: true,
              title: true
            }
          }
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.homeworkSend.count({ where: whereConditions }),
      // Statistiques globales
      prisma.homeworkSend.aggregate({
        _count: {
          id: true,
          userId: true
        },
        where: whereConditions
      }).then(async (agg) => {
        const [successfulSends, failedSends, uniqueUsers] = await Promise.all([
          prisma.homeworkSend.count({ 
            where: { ...whereConditions, emailSent: true } 
          }),
          prisma.homeworkSend.count({ 
            where: { ...whereConditions, emailSent: false } 
          }),
          prisma.homeworkSend.groupBy({
            by: ['userId'],
            where: whereConditions,
            _count: { userId: true }
          }).then(groups => groups.length)
        ]);
        
        return {
          totalSends: agg._count.id,
          successfulSends,
          failedSends,
          uniqueUsers
        };
      })
    ]);

    return NextResponse.json({
      sends: sends.map(send => ({
        id: send.id,
        sentAt: send.sentAt.toISOString(),
        emailSent: send.emailSent,
        user: send.user,
        homework: send.homework
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('Get homework sends error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des envois' },
      { status: 500 }
    );
  }
}