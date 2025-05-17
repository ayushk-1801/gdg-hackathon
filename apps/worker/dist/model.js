import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
const apiKey = process.env.GEMINI_API_KEY;
const ytapiKey = process.env.YOUTUBE_API_KEY;
if (!apiKey)
    throw new Error("GEMINI_API_KEY environment variable is not set");
if (!ytapiKey)
    throw new Error("YT_API_KEY environment variable is not set");
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [],
    responseMimeType: "application/json",
    responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
            summary: {
                type: SchemaType.STRING,
            },
            questions: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        question: {
                            type: SchemaType.STRING,
                        },
                        options: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.STRING,
                            },
                            minItems: 4,
                            maxItems: 4,
                        },
                        answer: {
                            type: SchemaType.STRING,
                        },
                        explanation: {
                            type: SchemaType.STRING,
                        },
                    },
                    required: ["question", "options", "answer", "explanation"],
                },
                minItems: 5,
                maxItems: 5,
            },
            links: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        url: { type: SchemaType.STRING },
                        title: { type: SchemaType.STRING },
                    },
                    required: ["url"],
                },
            },
        },
        required: ["summary", "questions", "links"],
    },
};
/**
 * Extracts links from a text string with context
 * @param text The text to extract links from
 * @returns Array of structured link objects found in the text
 */
function extractLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    if (!matches)
        return [];
    // Create structured link objects
    return matches.map((url) => {
        let title = "";
        // Try to extract a title from surrounding text (simple approach)
        const beforeUrl = text.substring(0, text.indexOf(url)).trim();
        const lastNewline = beforeUrl.lastIndexOf("\n");
        if (lastNewline !== -1) {
            title = beforeUrl.substring(lastNewline).trim();
        }
        return {
            url: url,
            title: title || "Related resource", // Default title if none found
        };
    });
}
/**
 * Fetches the YouTube video description using the YouTube API
 * @param videoId The YouTube video ID
 * @returns The video description
 */
async function getVideoDescription(videoId) {
    try {
        // Use Google's YouTube API to fetch video details
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${ytapiKey}&part=snippet`);
        if (response.data.items && response.data.items.length > 0) {
            return response.data.items[0].snippet.description || "";
        }
        return "";
    }
    catch (error) {
        console.error("Error fetching video description:", error);
        return "";
    }
}
/**
 * Processes a YouTube video by fetching its transcript and generating quiz questions
 * @param youtubeUrl The URL or ID of the YouTube video
 * @returns Structured data including summary and quiz questions
 */
async function processYoutubeVideo(youtubeUrl) {
    try {
        const videoId = youtubeUrl.includes("youtube.com") || youtubeUrl.includes("youtu.be")
            ? youtubeUrl.split("v=")[1]?.split("&")[0] ||
                youtubeUrl.split("youtu.be/")[1]?.split("?")[0] ||
                youtubeUrl
            : youtubeUrl;
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        if (!transcript || transcript.length === 0) {
            throw new Error("Could not fetch transcript for the provided video");
        }
        const description = await getVideoDescription(videoId);
        const links = extractLinks(description);
        const transcriptText = transcript.map((item) => item.text).join(" ");
        const chatSession = model.startChat({
            // @ts-ignore
            generationConfig,
            history: [],
        });
        const prompt = `Based on this YouTube video transcript, please generate a summary and 5 quiz questions with 4 options each, correct answers, and explanations:\n\n${transcriptText}`;
        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseText);
            parsedResponse.links = links;
        }
        catch (error) {
            console.error("Failed to parse Gemini response as JSON:", error);
            return responseText;
        }
        return parsedResponse;
    }
    catch (error) {
        console.error("Error processing YouTube video:", error);
        throw error;
    }
}
// Example usage
// async function run() {
//   const result = await processYoutubeVideo("https://youtu.be/zD2Jg3alZV8?si=p1FSj1j1sUzNyosN");
//   console.log(result);
// }
// run();
// Export the function and types
export { processYoutubeVideo };
//# sourceMappingURL=model.js.map