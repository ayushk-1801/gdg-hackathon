import  db  from "@repo/db";
import { enrollments, playlists } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  
  try {
    const userEnrollments = await db
      .select({
        enrollment: enrollments,
        playlist: playlists
      })
      .from(enrollments)
      .innerJoin(
        playlists,
        eq(enrollments.playlistLink, playlists.playlist_link)
      )
      .where(eq(enrollments.userId, userId));
    
    const formattedEnrollments = userEnrollments.map(({ enrollment, playlist }) => ({
      id: playlist.id,
      title: playlist.title,
      creator: playlist.creator,
      description: playlist.description,
      thumbnail: playlist.thumbnail,
      videoCount: playlist.videoCount,
      viewCount: playlist.viewCount,
      category: playlist.category,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt
    }));
    
    return NextResponse.json(formattedEnrollments);
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
