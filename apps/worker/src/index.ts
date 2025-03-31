import { Worker } from "bullmq";
import { connection } from "./connection.js";

const videoWorker = new Worker(
  "video",
  async (job) => {
    try {
      console.log(`[Worker] Starting job ${job.id} with data:`, job.data);
      
      const { videoId } = job.data;
      
      // Simulate video processing
      console.log(`[Worker] Processing video with ID: ${videoId}`);
      
      await job.updateProgress(25);
      console.log(`[Worker] Video processing 25% complete`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await job.updateProgress(50);
      console.log(`[Worker] Video processing 50% complete`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await job.updateProgress(75);
      console.log(`[Worker] Video processing 75% complete`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await job.updateProgress(100);
      console.log(`[Worker] Video processing 100% complete`);
      
      return { processed: true, videoId, completedAt: new Date().toISOString() };
    } catch (error) {
      console.error(`[Worker] Error processing job ${job.id}:`, error);
      throw error; 
    }
  },
  {
    connection,
    concurrency: 5, 
    removeOnComplete: { count: 100 }, 
    removeOnFail: { count: 100 },
  }
);

videoWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed successfully`);
});

videoWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} has failed with error:`, err);
});

videoWorker.on('error', (err) => {
  console.error(`[Worker] Worker error:`, err);
});

console.log('[Worker] Video processing worker started successfully');

export { videoWorker };
