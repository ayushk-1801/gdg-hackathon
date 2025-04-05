import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db";
import { playlists, videos, enrollments, user, videoProgress } from "@repo/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;
    
    const { userId, userEmail } = await request.json();
    
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "User information required" },
        { status: 400 }
      );
    }

    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
      
    if (userData.length === 0 || userData[0].email !== userEmail) {
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
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const course = courseData[0];
    
    const enrollmentData = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.playlistLink, course.playlist_link)
      ))
      .limit(1);

    if (enrollmentData.length === 0) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 403 }
      );
    }

    const enrollment = enrollmentData[0];
    
    const courseVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.playlist_link, course.playlist_link));

    console.log("Found course videos:", JSON.stringify({
      courseId,
      playlistLink: course.playlist_link, 
      videoCount: courseVideos.length
    }, null, 2));

    // Get completed videos from video_progress table
    const completedVideoProgress = await db
      .select()
      .from(videoProgress)
      .where(and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.enrollmentId, enrollment.id),
        eq(videoProgress.completed, true)
      ));

    // Create a set of completed video IDs for easy lookup
    const completedVideoIds = new Set(
      completedVideoProgress.map(progress => progress.videoId)
    );

    console.log("Found completed videos:", completedVideoIds.size);

    // Sort videos by their id for consistent ordering
    courseVideos.sort((a, b) => a.id.localeCompare(b.id));

    // Split videos into completed and remaining based on videoProgress records
    const completedVideos = courseVideos
      .filter(video => completedVideoIds.has(video.id))
      .map(video => ({
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`,
        videoId: video.videoId,
        summary: video.summary || "No summary available yet.",
        completed: true
      }));

    const remainingVideos = courseVideos
      .filter(video => !completedVideoIds.has(video.id))
      .map(video => ({
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`,
        videoId: video.videoId,
        summary: video.summary || "No summary available yet.",
        completed: false
      }));

    // Log the constructed video objects for debugging
    console.log("Video objects for client:", {
      completedCount: completedVideos.length,
      remainingCount: remainingVideos.length
    });

    // Calculate progress safely to avoid NaN
    let newProgress = 0;
    const totalVideos = courseVideos.length;
    
    // Only calculate percentage if we have videos
    if (totalVideos > 0) {
      newProgress = Math.min(
        100,
        Math.round((completedVideos.length / totalVideos) * 100)
      );
    }
    
    console.log("Calculated progress:", {
      completedCount: completedVideos.length,
      totalVideos,
      newProgress,
      currentProgress: enrollment.progress
    });
    
    // Update enrollment progress if it has changed and is a valid number
    if (newProgress !== enrollment.progress && !isNaN(newProgress)) {
      try {
        await db
          .update(enrollments)
          .set({
            progress: newProgress,
            completedAt: newProgress === 100 ? new Date() : null
          })
          .where(eq(enrollments.id, enrollment.id));
          
        // Update local enrollment object
        enrollment.progress = newProgress;
        console.log("Updated enrollment progress to:", newProgress);
      } catch (updateError) {
        console.error("Failed to update enrollment progress:", updateError);
        // Continue without failing the request
      }
    }

    return NextResponse.json({
      courseId: course.id,
      title: course.title || "Untitled Course",
      creator: "YouTube",
      completedVideos,
      remainingVideos,
      enrollment: {
        id: enrollment.id,
        progress: newProgress, // Use the safely calculated progress
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt
      },
      debug: {
        totalVideosFound: courseVideos.length,
        completedVideosCount: completedVideos.length
      }
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data", details: String(error) },
      { status: 500 }
    );
  }
}
