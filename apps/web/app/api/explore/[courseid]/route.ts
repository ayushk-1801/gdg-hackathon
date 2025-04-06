import  db  from "@repo/db";
import { playlists, videos, enrollments, user } from "@repo/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseid: string }> }
) {
  try {
    const { courseid: courseId } = await params;

    const courseData = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, courseId))
      .then((rows) => rows[0]);

    if (!courseData) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const courseVideos = courseData.playlist_link ? await db
      .select()
      .from(videos)
      .where(eq(videos.playlist_link, courseData.playlist_link))
    : [];

    // Always return these as false/null since we're not checking user-specific enrollment
    const isEnrolled = false;
    const enrollmentId = null;

    return NextResponse.json({
      course: {
        ...courseData,
        videos: courseVideos,
      },
      isEnrolled,
      enrollmentId,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseid: string }> }
) {
  try {
    const { userId } = await req.json();
    const courseId = (await params).courseid;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userExists = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .then((rows) => rows[0]);

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const course = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, courseId))
      .then((rows) => rows[0]);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!course.playlist_link) {
      return NextResponse.json(
        { error: "Invalid course playlist" },
        { status: 400 }
      );
    }

    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.playlistLink, course.playlist_link)
        )
      )
      .then((rows) => rows[0]);

    if (existingEnrollment) {
      return NextResponse.json(
        { 
          success: true,
          message: "Already enrolled in this course",
          enrollmentId: existingEnrollment.id,
        },
        { status: 200 }
      );
    }

    const enrollmentId = uuidv4();
    await db
      .insert(enrollments)
      .values({
        id: enrollmentId,
        userId: userId,
        playlistLink: course.playlist_link,
        enrolledAt: new Date(),
        progress: 0,
      });

    return NextResponse.json({
      success: true,
      message: "Enrolled successfully",
      enrollmentId: enrollmentId,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
