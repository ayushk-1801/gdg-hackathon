import { Queue } from "bullmq";
import Redis, { Redis as RedisClient, RedisOptions } from "ioredis";

// Redis connection configuration
const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: {}
};

// Queue name
const YOUTUBE_QUEUE_NAME = "youtube-video-processing";

// Interface for video job data
interface VideoJobData {
  videoUrl: string;
  playlistUrl?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Create the YouTube videos queue
export const youtubeQueue = new Queue<VideoJobData>(YOUTUBE_QUEUE_NAME, {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/**
 * Add a YouTube video URL to the processing queue
 * @param videoUrl - The YouTube video URL to process
 * @param playlistUrl - The playlist URL this video belongs to
 * @param userId - Optional user ID associated with the request
 * @param metadata - Optional additional metadata
 * @returns The created job object
 */
export async function addYoutubeVideoToQueue(
  videoUrl: string,
  playlistUrl: string,
  userId?: string,
  metadata?: Record<string, any>
) {
  console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);

  if (!videoUrl) {
    throw new Error("Video URL is required");
  }
  
  if (!playlistUrl) {
    throw new Error("Playlist URL is required");
  }

  // Basic validation for YouTube URLs
  if (!isValidYoutubeUrl(videoUrl)) {
    throw new Error("Invalid YouTube URL format");
  }

  try {
    const job = await youtubeQueue.add("process-video", {
      videoUrl,
      playlistUrl,
      userId,
      metadata,
    });

    console.log(`Added YouTube video to queue: ${videoUrl}, Job ID: ${job.id}`);
    return job;
  } catch (error) {
    console.error("Failed to add video to queue:", error);
    throw new Error(`Failed to queue video: ${error}`);
  }
}

/**
 * Add multiple YouTube videos from a playlist to the queue
 * @param videoUrls - Array of video URLs to process
 * @param playlistUrl - The playlist URL these videos belong to
 * @param userId - Optional user ID associated with the request
 * @param metadata - Optional additional metadata
 * @returns Array of created job objects
 */
export async function addPlaylistVideosToQueue(
  videoUrls: string[],
  playlistUrl: string,
  userId?: string,
  metadata: Record<string, any> = {}
) {
  if (!videoUrls.length) {
    throw new Error("No video URLs provided");
  }

  try {
    // Default metadata if none provided
    const videoMetadata = {
      ...metadata,
      playlistLink: playlistUrl, // Ensure playlistLink is always included
    };

    const jobs = await Promise.all(
      videoUrls.map(async (videoUrl) => {
        return addYoutubeVideoToQueue(videoUrl, playlistUrl, userId, videoMetadata);
      })
    );

    console.log(
      `Added ${jobs.length} videos from playlist to queue: ${playlistUrl}`
    );
    return jobs;
  } catch (error) {
    console.error("Failed to add playlist videos to queue:", error);
    throw new Error(`Failed to queue playlist videos: ${error}`);
  }
}

/**
 * Helper function to validate YouTube URLs
 */
function isValidYoutubeUrl(url: string): boolean {
  // More comprehensive YouTube URL validation
  const videoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/;
  const playlistRegex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+(&.*)?$/;
  return videoRegex.test(url) || playlistRegex.test(url);
}

/**
 * Get queue information
 */
export async function getQueueInfo() {
  const [waiting, active, completed, failed] = await Promise.all([
    youtubeQueue.getWaitingCount(),
    youtubeQueue.getActiveCount(),
    youtubeQueue.getCompletedCount(),
    youtubeQueue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
  };
}

/**
 * Clear all jobs from the YouTube processing queue
 * @returns Object with the status of the operation
 */
export async function clearQueue() {
  try {
    await youtubeQueue.drain();
    await youtubeQueue.clean(0, 1000, 'completed'); // clean up to 1000 completed jobs older than 0 ms
    await youtubeQueue.clean(0, 1000, 'failed');    // clean up to 1000 failed jobs older than 0 ms

    return { success: true, message: "Queue cleared successfully" };
  } catch (error) {
    console.error("Failed to clear queue:", error);
    throw new Error(`Failed to clear queue: ${error}`);
  }
}

// Export the queue for external use
export default {
  youtubeQueue,
  addYoutubeVideoToQueue,
  addPlaylistVideosToQueue,
  getQueueInfo,
  clearQueue,
};

console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
