import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db";
import { videos } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: { courseId: string; videoId: string } }
) {
  try {
    const videoId = params.videoId;
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Fetch the video to get its quiz questions
    const videoData = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (videoData.length === 0) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const video = videoData[0];
    console.log("Raw video data:", JSON.stringify(video));
    console.log("Quiz data type:", typeof video.quizzes);
    
    let questions = [];

    // Parse the quiz data - handle different formats
    if (video.quizzes) {
      try {
        if (Array.isArray(video.quizzes)) {
          questions = video.quizzes;
        } else if (typeof video.quizzes === 'string') {
          questions = JSON.parse(video.quizzes);
        } else if (typeof video.quizzes === 'object') {
          // If it's an object, try to convert it to an array if it's not already one
          questions = Object.values(video.quizzes);
        }
      } catch (e) {
        console.error("Error parsing quiz data:", e);
      }
    }

    // Debug the parsed questions
    console.log("Parsed questions:", JSON.stringify(questions));

    // If no questions were found or there was an error parsing them, provide sample questions
    if (!Array.isArray(questions) || questions.length === 0) {
      questions = [
        {
          question: "What is the primary characteristic of a greedy algorithm?",
          options: [
            "It always finds the optimal solution.",
            "It makes locally optimal choices at each step.",
            "It considers all possible solutions before making a decision.",
            "It uses a backtracking approach to explore solutions."
          ],
          answer: "It makes locally optimal choices at each step.",
          explanation: "Greedy algorithms prioritize immediate gains at each stage, aiming for the best local choice without considering the long-term consequences."
        },
        {
          question: "Which of the following is NOT a typical application of greedy algorithms?",
          options: [
            "Knapsack problem",
            "Shortest path finding",
            "Traveling salesman problem",
            "Sorting algorithms"
          ],
          answer: "Traveling salesman problem",
          explanation: "The traveling salesman problem is typically solved using more advanced techniques like dynamic programming or heuristics, as it's NP-hard."
        }
      ];
    }

    console.log("Returning questions:", JSON.stringify(questions));
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz questions", details: String(error) },
      { status: 500 }
    );
  }
}
