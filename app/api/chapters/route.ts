import { NextResponse } from 'next/server';
import { Chapter } from '@/types/chapter';
import { chapters } from '@/lib/chapters'; // Import the chapters array

export async function GET() {
  try {
    // No need to await since chapters is already an array, not a function
    return NextResponse.json(chapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}