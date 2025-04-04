import { Queue } from "bullmq";
import { RedisOptions } from "ioredis";

// Redis connection configuration
const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

// Queue name
const YOUTUBE_QUEUE_NAME = "youtube-video-processing";

// Interface for video job data
interface VideoJobData {
  videoUrl: string;
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
 * @param userId - Optional user ID associated with the request
 * @param metadata - Optional additional metadata
 * @returns The created job object
 */
export async function addYoutubeVideoToQueue(
  videoUrl: string,
  userId?: string,
  metadata?: Record<string, any>
) {
  if (!videoUrl) {
    throw new Error("Video URL is required");
  }

  // Basic validation for YouTube URLs
  if (!isValidYoutubeUrl(videoUrl)) {
    throw new Error("Invalid YouTube URL format");
  }

  try {
    const job = await youtubeQueue.add("process-video", {
      videoUrl,
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
 * Helper function to validate YouTube URLs
 */
function isValidYoutubeUrl(url: string): boolean {
  // Basic YouTube URL validation
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(&.*)?$/;
  return youtubeRegex.test(url);
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

// Export the queue for external use
export default {
  youtubeQueue,
  addYoutubeVideoToQueue,
  getQueueInfo,
};
