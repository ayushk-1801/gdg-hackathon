/**
 * Client-side wrapper for the worker queue
 * This avoids importing Node.js-specific modules in the browser
 */

/**
 * Add a video job to the queue through API
 * @param videoId The ID of the video to process
 */
export async function addVideoJob(videoId: string): Promise<void> {
  try {
    const response = await fetch('/api/queue/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add job: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding job to queue:', error);
    throw error;
  }
}

/**
 * Add multiple video jobs to the queue through API
 * @param videoIds Array of video IDs to process
 */
export async function addVideoJobs(videoIds: string[]): Promise<void> {
  try {
    const response = await fetch('/api/queue/video/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add jobs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding jobs to queue:', error);
    throw error;
  }
}
