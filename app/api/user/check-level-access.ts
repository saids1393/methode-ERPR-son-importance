import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const module = searchParams.get('module') as 'LECTURE' | 'TAJWID' | null;

    if (!module || (module !== 'LECTURE' && module !== 'TAJWID')) {
      return NextResponse.json(
        { error: 'Invalid module parameter' },
        { status: 400 }
      );
    }

    // Chercher le niveau correspondant au module
    const level = await prisma.level.findFirst({
      where: {
        module: module,
        isActive: true
      }
    });

    if (!level) {
      return NextResponse.json(
        { hasAccess: false, reason: 'Module not available' },
        { status: 200 }
      );
    }

    // Vérifier si l'utilisateur a acheté ce niveau
    const purchase = await prisma.levelPurchase.findFirst({
      where: {
        userId: user.id,
        levelId: level.id
      }
    });

    const hasAccess = !!purchase;

    return NextResponse.json({
      hasAccess,
      levelId: level.id,
      levelTitle: level.title,
      module: level.module
    });
  } catch (error) {
    console.error('Error checking level access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
