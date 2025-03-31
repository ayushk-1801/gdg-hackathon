import { NextRequest, NextResponse } from 'next/server';
import { addVideoJobs } from '@repo/worker/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoIds } = body;

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json(
        { error: 'Valid videoIds array is required' },
        { status: 400 }
      );
    }

    const jobs = await addVideoJobs(videoIds);

    return NextResponse.json(
      { success: true, jobCount: jobs.length },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding jobs to queue:', error);
    return NextResponse.json(
      { error: 'Failed to add jobs to queue' },
      { status: 500 }
    );
  }
}
