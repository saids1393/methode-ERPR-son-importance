import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  context: any // ✅ on enlève le typage strict ici pour éviter l'erreur
) {
  try {
    const chapterId = context.params.id;

    const chapter = await getChapterById(chapterId);

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Get chapter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getChapterById(chapterId: string) {
  // Simule un résultat pour tester
  return { id: chapterId, title: 'Fake Chapter' };
}
