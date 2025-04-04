import { NextRequest, NextResponse } from 'next/server';
import { addYoutubeVideoToQueue } from '@repo/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoUrl, userId, metadata, playlistUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    if (!playlistUrl) {
      return NextResponse.json(
        { error: 'Playlist URL is required' },
        { status: 400 }
      );
    }

    // Add the video to the processing queue
    const job = await addYoutubeVideoToQueue(videoUrl, playlistUrl, userId, metadata);

    return NextResponse.json(
      { 
        success: true, 
        id: job.id,
        status: 'queued' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding video to queue:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
