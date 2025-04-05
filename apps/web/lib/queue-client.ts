/**
 * Client-side functions to interact with the queue API
 */

// The API endpoint for adding videos to the queue
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface JobResponse {
  id: string;
  status: string;
}

/**
 * Add a YouTube video to the processing queue
 * @param videoUrl - The YouTube video URL to process
 * @param userId - Optional user ID associated with the request
 * @param metadata - Optional additional metadata
 * @returns The job information from the API
 */
export async function addVideoJob(
  videoUrl: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<JobResponse> {
  if (!videoUrl) {
    throw new Error("Video URL is required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/queue/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl,
        userId,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding video to queue:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to add video to queue');
  }
}
