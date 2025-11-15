import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { checkFreeTrialAccess } from '@/lib/free-trial-access';

// API DEPRECATED - Utilisez /api/auth/get-user à la place
// Cette API était problématique car elle mettait à jour trialExpired automatiquement
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'API deprecated. Use /api/auth/get-user instead' },
    { status: 410 } // Gone
  );
}
