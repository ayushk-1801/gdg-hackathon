import { Queue } from "bullmq";
import { connection } from "./connection.js";

const videoQueue = new Queue("video", {
  connection,
});

/**
 * Add a single video job to the queue
 * @param videoId The ID of the video to process
 */
export const addVideoJob = async (videoId: string) => {
  console.log(`[Queue] Adding job for video: ${videoId}`);
  return await videoQueue.add("video", { videoId });
};

/**
 * Add multiple video jobs to the queue in bulk
 * @param videoIds Array of video IDs to process
 */
export const addVideoJobs = async (videoIds: string[]) => {
  console.log(`[Queue] Adding ${videoIds.length} jobs in bulk`);
  const jobs = videoIds.map((videoId) => ({
    name: "video",
    data: { videoId },
  }));
  return await videoQueue.addBulk(jobs);
};

export { videoQueue };