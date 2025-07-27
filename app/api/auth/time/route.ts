import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        studyTimeSeconds: true,
      },
    });

    return NextResponse.json({
      studyTimeSeconds: userData?.studyTimeSeconds || 0,
    });
  } catch (error) {
    console.error('Get study time error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { timeToAdd } = await request.json();

    if (typeof timeToAdd !== 'number' || timeToAdd < 0) {
      return NextResponse.json(
        { error: 'Temps invalide' },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { studyTimeSeconds: true },
    });

    const currentTime = currentUser?.studyTimeSeconds || 0;
    const newTime = currentTime + timeToAdd;

    await prisma.user.update({
      where: { id: user.id },
      data: { studyTimeSeconds: newTime },
    });

    return NextResponse.json({ 
      success: true, 
      studyTimeSeconds: newTime 
    });
  } catch (error) {
    console.error('Update study time error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}