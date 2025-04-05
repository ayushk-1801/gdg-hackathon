import { NextResponse } from "next/server";
import db from "@repo/db";
import { playlists, enrollments, user } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const { playlistUrl, userId, userEmail } = await request.json();
    
    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 }
      );
    }
    
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "User information is required" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "Invalid user" },
        { status: 401 }
      );
    }

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
    
    const playlist = existingPlaylist[0];

    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.playlistLink, playlistUrl)
      ))
      .limit(1);

    let enrollment;
    let isNewEnrollment = false;

    if (existingEnrollment.length === 0) {
      const enrollmentId = nanoid();
      const newEnrollment = {
        id: enrollmentId,
        userId,
        playlistLink: playlistUrl,
        enrolledAt: new Date(),
        progress: 0,
      };
      
      await db.insert(enrollments).values(newEnrollment);
      enrollment = newEnrollment;
      isNewEnrollment = true;
    } else {
      enrollment = existingEnrollment[0];
    }

    if(!playlist){
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    if(!enrollment){
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      courseId: playlist.id,
      playlistUrl: playlist.playlist_link,
      title: playlist.title || "Untitled Course",
      enrollment: {
        id: enrollment.id,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedAt: null,
      },
      message: isNewEnrollment 
        ? "Successfully enrolled in course" 
        : "You are already enrolled in this course",
      status: isNewEnrollment ? "enrolled" : "existing",
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to enroll in course",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
