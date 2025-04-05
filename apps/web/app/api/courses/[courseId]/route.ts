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
        { status: 500 }
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

    const courseVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.playlist_link, course.playlist_link));

    console.log(
      "Found course videos:",
      JSON.stringify(
        {
          courseId,
          playlistLink: course.playlist_link,
          videoCount: courseVideos.length,
        },
        null,
        2
      )
    );

    const completedVideoProgress = await db
      .select()
      .from(videoProgress)
      .where(
        and(
          eq(videoProgress.userId, userId),
          eq(videoProgress.enrollmentId, enrollment.id),
          eq(videoProgress.completed, true)
        )
      );

    const completedVideoIds = new Set(
      completedVideoProgress.map((progress) => progress.videoId)
    );

    console.log("Found completed videos:", completedVideoIds.size);

    courseVideos.sort((a, b) => a.id.localeCompare(b.id));

    const formatQuizData = (quizData: any) => {
      if (!quizData) return [];
      
      try {
        if (Array.isArray(quizData)) {
          return quizData;
        } else if (typeof quizData === 'string') {
          return JSON.parse(quizData);
        } else if (typeof quizData === 'object') {
          // Could be an object with quiz questions as values
          return Object.values(quizData);
        }
      } catch (e) {
        console.error("Error formatting quiz data:", e);
      }
      return [];
    };

    const completedVideos = courseVideos
      .filter((video) => completedVideoIds.has(video.id))
      .map((video) => {
        console.log(`Processing video ${video.id}, quizzes type:`, typeof video.quizzes);
        
        return {
          id: video.id,
          title: video.title,
          url: `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`,
          videoId: video.videoId,
          summary: video.summary || "No summary available yet.",
          thumbnail:
            video.thumbnail ||
            `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
          completed: true,
          quizzes: formatQuizData(video.quizzes)
        };
      });

    const remainingVideos = courseVideos
      .filter((video) => !completedVideoIds.has(video.id))
      .map((video) => {
        console.log(`Processing video ${video.id}, quizzes type:`, typeof video.quizzes);
        
        return {
          id: video.id,
          title: video.title,
          url: `https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`,
          videoId: video.videoId,
          summary: video.summary || "No summary available yet.",
          thumbnail:
            video.thumbnail ||
            `https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`,
          completed: false,
          quizzes: formatQuizData(video.quizzes)
        };
      });

    // Debug quiz data more thoroughly
    if (remainingVideos.length > 0) {
      const firstVideo = remainingVideos[0];
      if (firstVideo) {
        console.log("First video quiz data details:", {
          videoId: firstVideo.id,
          hasQuizzes: Boolean(firstVideo.quizzes),
          quizzesType: typeof firstVideo.quizzes,
          isArray: Array.isArray(firstVideo.quizzes),
          quizzesLength: Array.isArray(firstVideo.quizzes) ? firstVideo.quizzes.length : 'N/A',
          sample: Array.isArray(firstVideo.quizzes) && firstVideo.quizzes.length > 0 
            ? JSON.stringify(firstVideo.quizzes[0]) 
            : 'No quizzes available'
        });
      }
    }

    console.log("Video objects for client:", {
      completedCount: completedVideos.length,
      remainingCount: remainingVideos.length,
    });

    let newProgress = 0;
    const totalVideos = courseVideos.length;

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
      currentProgress: enrollment.progress,
    });

    if (newProgress !== enrollment.progress && !isNaN(newProgress)) {
      try {
        await db
          .update(enrollments)
          .set({
            progress: newProgress,
            completedAt: newProgress === 100 ? new Date() : null,
          })
          .where(eq(enrollments.id, enrollment.id));

        enrollment.progress = newProgress;
        console.log("Updated enrollment progress to:", newProgress);
      } catch (updateError) {
        console.error("Failed to update enrollment progress:", updateError);
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
        progress: newProgress,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      },
      debug: {
        totalVideosFound: courseVideos.length,
        completedVideosCount: completedVideos.length,
      },
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return NextResponse.json(
      { error: "Failed to fetch course data", details: String(error) },
      { status: 500 }
    );
  }
}
