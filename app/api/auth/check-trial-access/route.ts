import { NextResponse } from 'next/server';

// API DEPRECATED - Utilisez /api/auth/get-user à la place
// Cette API était problématique car elle mettait à jour trialExpired automatiquement
export async function GET() {
  return NextResponse.json(
    { error: 'API deprecated. Use /api/auth/get-user instead' },
    { status: 410 } // Gone
  );
}
