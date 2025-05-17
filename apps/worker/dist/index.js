import { Worker } from "bullmq";
import axios from "axios";
import db from "@repo/db/js";
import { videos, playlists } from "@repo/db/schema.js";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { processYoutubeVideo } from "./model.js"; // Import the local model function
// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos";
/**
 * Extract YouTube ID from a URL
 * @param url YouTube URL
 * @returns YouTube video ID
 */
function extractYoutubeId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (!match || !match[1])
        throw new Error("Invalid YouTube URL format");
    return match[1];
}
/**
 * Process the video using the local model
 * @param videoUrl YouTube video URL
 * @returns Model processing result
 */
async function processVideoWithModel(videoUrl) {
    try {
        // Use local model instead of API call
        const result = await processYoutubeVideo(videoUrl);
        return {
            summary: result.summary,
            mcqs: result.questions,
            references: result.links
        };
    }
    catch (error) {
        console.error("Error processing video with model:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Model processing failed: ${errorMessage}`);
    }
}
/**
 * Fetch video details from YouTube API
 * @param videoId YouTube video ID
 * @returns Video details including title and thumbnail URL
 */
async function fetchYoutubeVideoDetails(videoId) {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API key not configured. Using default video metadata.");
        return null;
    }
    try {
        const response = await axios.get(YOUTUBE_API_URL, {
            params: {
                key: YOUTUBE_API_KEY,
                id: videoId,
                part: 'snippet'
            }
        });
        if (!response.data || !response.data.items || response.data.items.length === 0) {
            throw new Error(`No video found with ID: ${videoId}`);
        }
        const videoData = response.data.items[0].snippet;
        return {
            title: videoData.title,
            thumbnail: videoData.thumbnails?.high?.url || videoData.thumbnails?.default?.url || "",
        };
    }
    catch (error) {
        console.error("Error fetching YouTube video details:", error);
        return null;
    }
}
/**
 * Creates a delay for the specified number of milliseconds
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/**
 * Save video processing results to the database
 * @param videoUrl YouTube video URL
 * @param processedResult Processing result from model API
 * @param playlistLink Optional playlist link if video belongs to a playlist
 * @returns The database entry
 */
async function saveResultToDatabase(videoUrl, processedResult, playlistLink) {
    try {
        const videoId = extractYoutubeId(videoUrl);
        // Require a valid playlist link
        if (!playlistLink) {
            throw new Error("Playlist link is required. Videos must belong to a playlist.");
        }
        const playlistLinkValue = playlistLink;
        // Check if the playlist exists - note we're using playlist_link field
        const existingPlaylist = await db
            .select()
            .from(playlists)
            .where(eq(playlists.playlist_link, playlistLinkValue));
        // If playlist doesn't exist, create it first
        if (existingPlaylist.length === 0) {
            console.log(`Creating new playlist: ${playlistLinkValue}`);
            // Generate a UUID for the playlist ID
            const playlistId = uuidv4();
            console.log(`Generated playlist ID: ${playlistId}`);
            try {
                await db.insert(playlists).values({
                    id: playlistId, // Explicitly assign the ID
                    playlist_link: playlistLinkValue,
                    title: `Playlist from ${playlistLinkValue}`
                });
                console.log(`Successfully created playlist with ID: ${playlistId}`);
            }
            catch (error) {
                console.error(`Error creating playlist:`, error);
                throw new Error(`Failed to create playlist: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        else {
            console.log(`Using existing playlist with ID: ${existingPlaylist[0]?.id}`);
        }
        // Fetch video details from YouTube API
        console.log(`Fetching YouTube details for video ID: ${videoId}`);
        const youtubeDetails = await fetchYoutubeVideoDetails(videoId);
        // Prepare data for video insertion
        const videoData = {
            id: uuidv4(),
            videoId: videoId,
            title: youtubeDetails?.title || processedResult.title || "",
            thumbnail: youtubeDetails?.thumbnail || processedResult.thumbnail || "",
            playlist_link: playlistLinkValue,
            summary: processedResult.summary || "",
            quizzes: processedResult.mcqs || [],
            refLink: processedResult.references || [], // This now stores links in the new format
        };
        console.log(`Saving video data to database for video ID: ${videoId}`);
        // Insert into database
        const result = await db.insert(videos).values(videoData).returning();
        if (!result?.[0])
            throw new Error('Failed to insert video into database');
        console.log(`Successfully saved to database with ID: ${result[0].id}`);
        return result[0];
    }
    catch (error) {
        console.error("Error saving to database:", error);
        throw new Error(`Database operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
// Create a worker to process the queue
const worker = new Worker("youtube-video-processing", async (job) => {
    try {
        console.log(`Processing job ${job.id}: ${job.data.videoUrl}`);
        // Extract data from job
        const { videoUrl, userId, metadata } = job.data;
        // Process the video using the model API
        console.log(`Sending video to model API: ${videoUrl}`);
        const result = await processVideoWithModel(videoUrl);
        // Parse the response if it's a string (sometimes APIs return JSON as string)
        let processedResult = result;
        // Log the model API response (limited to avoid console clutter)
        const summaryPreview = processedResult.summary ?
            `${processedResult.summary.substring(0, 100)}...` : 'No summary';
        console.log(`Model API response preview: ${summaryPreview}`);
        // Log the detailed results
        console.log(`Processed video successfully! Job ID: ${job.id}`);
        console.log(`Summary length: ${processedResult.summary ? processedResult.summary.length : 0} characters`);
        console.log(`Generated ${processedResult.mcqs ? processedResult.mcqs.length : 0} multiple choice questions`);
        if (processedResult.mcqs?.length > 0) {
            console.log("First question:", processedResult.mcqs[0].question);
        }
        // Save the result to database
        const playlistLink = metadata?.playlistLink || null;
        const dbEntry = await saveResultToDatabase(videoUrl, processedResult, playlistLink);
        console.log(`Data saved to database with ID: ${dbEntry.id}`);
        // Wait for 30 seconds (30000 milliseconds) after processing
        console.log(`Waiting for 30 seconds before completing job ${job.id}...`);
        await delay(15000);
        console.log(`Wait complete for job ${job.id}`);
        // Return basic information and database reference instead of full result
        return {
            success: true,
            videoUrl,
            userId,
            videoId: dbEntry.id,
            processedAt: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        throw error; // Rethrow to mark job as failed
    }
}, {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        tls: {}
    },
});
// Handle worker events
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed with error:`, err);
});
console.log("YouTube video processing worker started");
console.log(process.env.REDIS_HOST, process.env.REDIS_PORT);
// clearQueue().then(() => {
//   console.log("Queue cleared successfully");
// }).catch(error => {
//   console.error("Error clearing queue:", error);
// });
//# sourceMappingURL=index.js.map