import { NextResponse } from 'next/server';
import { Chapter } from '@/types/chapter';

export async function GET() {
  try {
    // Récupération des chapitres (remplacez par votre logique réelle)
    const chapters: Chapter[] = await getChapters();
    
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}