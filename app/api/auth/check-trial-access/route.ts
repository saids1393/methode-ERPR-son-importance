import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkFreeTrialAccess } from '@/lib/free-trial-access';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const accessInfo = await checkFreeTrialAccess(user.id);

    return NextResponse.json({
      hasAccess: accessInfo.hasAccess,
      isFreeTrial: accessInfo.isFreeTrial,
      daysLeft: accessInfo.daysLeft,
      reason: accessInfo.reason
    });
  } catch (error) {
    console.error('Check trial access error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
