import { NextResponse } from 'next/server';
import db from '@repo/db';
import { playlists } from '@repo/db/schema';

export async function GET() {
  try {
    const allPlaylists = await db.select().from(playlists);
    
    return NextResponse.json({
      success: true,
      data: allPlaylists,
    });
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch playlists',
      },
      { status: 500 }
    );
  }
}
