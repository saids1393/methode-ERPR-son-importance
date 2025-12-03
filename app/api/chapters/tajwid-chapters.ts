import { NextResponse } from 'next/server';
import { chaptersTajwid } from '@/lib/chapters-tajwid';

export async function GET() {
  try {
    return NextResponse.json(chaptersTajwid);
  } catch (error) {
    console.error('Get Tajwid chapters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
