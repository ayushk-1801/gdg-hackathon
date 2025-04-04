import { NextResponse } from "next/server";
import db from "@repo/db";
import { playlists, enrollments } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { authClient } from "@/lib/auth-client"
 

export async function POST(request: Request) {
  try {
const { data: session } = await authClient.getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { playlistUrl } = await request.json();
    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 }
      );
    }

    // Check if the playlist exists
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .limit(1);

    if (existingPlaylist.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if the user is already enrolled
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.playlistLink, playlistUrl)
      ))
      .limit(1);

    // If not enrolled, create enrollment
    if (existingEnrollment.length === 0) {
      const enrollmentId = nanoid();
      await db.insert(enrollments).values({
        id: enrollmentId,
        userId,
        playlistLink: playlistUrl,
        enrolledAt: new Date(),
        progress: 0,
      });
    }

    // For this simple implementation, we're using the playlist URL as courseId
    // In a real app, you might have a separate courseId
    return NextResponse.json({
      courseId: existingPlaylist[0]?.playlist_link ?? playlistUrl,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
