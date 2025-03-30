import { NextRequest, NextResponse } from 'next/server';
import { addVideoJob } from '@repo/worker/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const job = await addVideoJob(videoId);

    return NextResponse.json(
      { success: true, jobId: job.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding job to queue:', error);
    return NextResponse.json(
      { error: 'Failed to add job to queue' },
      { status: 500 }
    );
  }
}
