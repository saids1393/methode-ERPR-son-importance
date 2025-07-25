import { NextResponse } from 'next/server';
import { Chapter } from '@/types/chapter';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const chapterId = params.id;
    
    // Récupération du chapitre (remplacez par votre logique réelle)
    const chapter: Chapter | null = await getChapterById(chapterId);
    
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