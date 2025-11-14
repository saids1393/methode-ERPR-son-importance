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

    const expiredTrials = await prisma.user.updateMany({
      where: {
        accountType: 'FREE_TRIAL',
        trialExpired: false,
        trialEndDate: {
          lt: now
        }
      },
      data: {
        trialExpired: true
      }
    });

    console.log(`Expired ${expiredTrials.count} free trials`);

    return NextResponse.json({
      success: true,
      expired: expiredTrials.count,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Expire free trials cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
