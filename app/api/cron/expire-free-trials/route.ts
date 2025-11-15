// app/api/cron/expire-free-trials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'default-cron-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();

    // Trouver les trials qui ont EXACTEMENT 7 jours ou plus
    // et qui ne sont pas encore expirés
    const expiredTrials = await prisma.user.updateMany({
      where: {
        accountType: 'FREE_TRIAL',
        trialExpired: false,
        trialEndDate: {
          lte: now // Seulement si trialEndDate <= maintenant
        }
      },
      data: {
        trialExpired: true
      }
    });

    console.log(`✅ CRON: Expiré ${expiredTrials.count} essais gratuits de 7+ jours`);

    return NextResponse.json({
      success: true,
      expired: expiredTrials.count,
      timestamp: now.toISOString(),
      message: `${expiredTrials.count} trials expirés après 7+ jours`
    });
  } catch (error) {
    console.error('❌ CRON: Erreur expire-free-trials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
