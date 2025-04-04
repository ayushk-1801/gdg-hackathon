import { NextRequest, NextResponse } from 'next/server';
import  db  from '@repo/db';
import { playlists } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import { addPlaylistVideosToQueue } from '@repo/queue';

function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match && match[1] ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const { playlistUrl, playlistData } = await req.json();
    
    if (!playlistUrl || !playlistData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return NextResponse.json({ error: 'Invalid YouTube playlist URL' }, { status: 400 });
    }
    
    // Check if playlist exists in the database
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .execute();
    
    if (existingPlaylist && existingPlaylist.length > 0) {
      // Playlist already exists
      return NextResponse.json({ 
        exists: true,
        message: 'Playlist already exists in the database'
      });
    }
    
    // Add playlist to database
    await db.insert(playlists).values({
      playlist_link: playlistUrl,
    }).execute();
    
    // Prepare video URLs for queue
    const selectedVideos = playlistData.videos.filter((_: any, index: number) => 
      playlistData.selectedIndices.includes(index)
    );
    
    const videoUrls = selectedVideos.map((video: any) => 
      `https://www.youtube.com/watch?v=${video.videoId}`
    );
    
    // Add all videos to the queue
    await addPlaylistVideosToQueue(videoUrls, playlistUrl);
    
    return NextResponse.json({ 
      success: true,
      message: 'Playlist added to database and processing queue',
      videoCount: videoUrls.length
    });
    
  } catch (error: any) {
    console.error('Error processing playlist:', error);
    return NextResponse.json({ 
      error: error.message || 'An error occurred while processing your request' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const playlistUrl = url.searchParams.get('url');
    
    if (!playlistUrl) {
      return NextResponse.json({ error: 'Missing playlist URL' }, { status: 400 });
    }
    
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .execute();
    
    return NextResponse.json({ 
      exists: existingPlaylist.length > 0
    });
    
  } catch (error: any) {
    console.error('Error checking playlist:', error);
    return NextResponse.json({ 
      error: error.message || 'An error occurred while processing your request' 
    }, { status: 500 });
  }
}
