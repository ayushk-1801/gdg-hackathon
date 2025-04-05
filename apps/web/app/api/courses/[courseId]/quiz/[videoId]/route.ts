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

    const videoData = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (videoData.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = videoData[0]!;
    console.log("Raw video data:", JSON.stringify(video));
    console.log("Quiz data type:", typeof video.quizzes);

    let questions = [];

    if (video.quizzes) {
      try {
        if (Array.isArray(video.quizzes)) {
          questions = video.quizzes;
        } else if (typeof video.quizzes === "string") {
          questions = JSON.parse(video.quizzes);
        } else if (typeof video.quizzes === "object") {
          questions = Object.values(video.quizzes);
        }
      } catch (e) {
        console.error("Error parsing quiz data:", e);
      }
    }

    console.log("Parsed questions:", JSON.stringify(questions));

    if (!Array.isArray(questions) || questions.length === 0) {
      questions = [];
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
