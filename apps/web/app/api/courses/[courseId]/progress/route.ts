import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db";
import {
  playlists,
  videos,
  enrollments,
  user,
  videoProgress,
} from "@repo/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const courseId = (await params).courseId;

    const { userId, userEmail, videoId, completed } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "User information required" },
        { status: 400 }
      );
    }

    if (!videoId || completed === undefined) {
      return NextResponse.json(
        { error: "Video ID and completion status required" },
        { status: 400 }
      );
    }

    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userData.length === 0 || userData[0]?.email !== userEmail) {
      return NextResponse.json(
        { error: "Invalid user credentials" },
        { status: 401 }
      );
    }

    const courseData = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, courseId))
      .limit(1);

    if (courseData.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const course = courseData[0]!;

    if (!course.playlist_link) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 }
      );
    }

    const enrollmentData = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.playlistLink, course.playlist_link)
        )
      )
      .limit(1);

    if (enrollmentData.length === 0) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    const enrollment = enrollmentData[0];

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const existingProgress = await db
      .select()
      .from(videoProgress)
      .where(
        and(
          eq(videoProgress.userId, userId),
          eq(videoProgress.videoId, videoId),
          eq(videoProgress.enrollmentId, enrollment.id)
        )
      )
      .limit(1);

    if (existingProgress.length === 0) {
      const progressId = nanoid();
      await db.insert(videoProgress).values({
        id: progressId,
        userId,
        videoId,
        enrollmentId: enrollment.id,
        completed,
        completedAt: completed ? new Date() : null,
      });
    } else {
      const progress = existingProgress[0];
      if (!progress) {
        throw new Error("Progress record not found");
      }
      await db
        .update(videoProgress)
        .set({
          completed,
          completedAt: completed ? new Date() : (progress.completedAt ?? null),
        })
        .where(eq(videoProgress.id, progress.id));
    }

    const allVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.playlist_link, course.playlist_link));

    const completedVideos = await db
      .select()
      .from(videoProgress)
      .where(
        and(
          eq(videoProgress.userId, userId),
          eq(videoProgress.enrollmentId, enrollment.id),
          eq(videoProgress.completed, true)
        )
      );

    let newProgress = 0;
    const totalVideos = allVideos.length;
    const completedCount = completedVideos.length;

    if (totalVideos > 0) {
      newProgress = Math.min(
        100,
        Math.round((completedCount / totalVideos) * 100)
      );
    }

    console.log(
      `Progress update: ${completedCount}/${totalVideos} videos (${newProgress}%)`
    );

    if (!isNaN(newProgress)) {
      await db
        .update(enrollments)
        .set({
          progress: newProgress,
          completedAt:
            newProgress === 100 ? new Date() : enrollment.completedAt,
        })
        .where(eq(enrollments.id, enrollment.id));
    } else {
      console.error("Invalid progress value (NaN). Using 0 instead.");
      await db
        .update(enrollments)
        .set({
          progress: 0,
          completedAt: null,
        })
        .where(eq(enrollments.id, enrollment.id));
      newProgress = 0;
    }

    return NextResponse.json({
      success: true,
      progress: newProgress,
      completed: newProgress === 100,
      videoId,
      videoCompleted: completed,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress", details: String(error) },
      { status: 500 }
    );
  }
}
