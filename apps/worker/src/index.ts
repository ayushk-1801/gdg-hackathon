import { Worker } from "bullmq";
import { youtubeQueue } from "@repo/queue";
import axios from "axios";

// Model service configuration
const MODEL_API_URL =
  process.env.MODEL_API_URL || "http://localhost:8000/transcript";

/**
 * Extract YouTube ID from a URL
 * @param url YouTube URL
 * @returns YouTube video ID
 */
function extractYoutubeId(url: string): string {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (!match || !match[1]) throw new Error("Invalid YouTube URL format");
  return match[1];
}

/**
 * Process the video by sending to the model API
 * @param videoUrl YouTube video URL
 * @returns Model processing result
 */
async function processVideoWithModel(videoUrl: string) {
  try {
    const response = await axios.get(MODEL_API_URL, {
      params: { yt_link: videoUrl },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling model API:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Model API processing failed: ${errorMessage}`);
  }
}

/**
 * Creates a delay for the specified number of milliseconds
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Create a worker to process the queue
const worker = new Worker(
  "youtube-video-processing",
  async (job) => {
    try {
      console.log(`Processing job ${job.id}: ${job.data.videoUrl}`);

      // Extract data from job
      const { videoUrl, userId, metadata } = job.data;

      // Process the video using the model API
      console.log(`Sending video to model API: ${videoUrl}`);
      const result = await processVideoWithModel(videoUrl);

      // Parse the response if it's a string (sometimes APIs return JSON as string)
      let processedResult = result;
      if (typeof result === 'string' && result.trim().startsWith('{')) {
        try {
          processedResult = JSON.parse(result);
        } catch (e) {
          console.warn("Could not parse result as JSON, using as-is");
        }
      }

      // Log the model API response (limited to avoid console clutter)
      const summaryPreview = processedResult.summary ? 
        `${processedResult.summary.substring(0, 100)}...` : 'No summary';
      console.log(`Model API response preview: ${summaryPreview}`);

      // Log the detailed results
      console.log(`Processed video successfully! Job ID: ${job.id}`);
      console.log(`Summary length: ${processedResult.summary ? processedResult.summary.length : 0} characters`);
      console.log(
        `Generated ${processedResult.mcqs ? processedResult.mcqs.length : 0} multiple choice questions`
      );

      if (processedResult.mcqs?.length > 0) {
        console.log("First question:", processedResult.mcqs[0].question);
      }

      // Wait for 1 minute (60000 milliseconds) after processing
      console.log(`Waiting for 1 minute before completing job ${job.id}...`);
      await delay(60000);
      console.log(`Wait complete for job ${job.id}`);

      // Return the processing results
      return {
        success: true,
        videoUrl,
        userId,
        result: processedResult,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error; // Rethrow to mark job as failed
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
    },
  }
);

// Handle worker events
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});

console.log("YouTube video processing worker started");
