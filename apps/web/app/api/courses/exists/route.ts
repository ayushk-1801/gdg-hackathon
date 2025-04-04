import { NextResponse } from "next/server";
import db from "@repo/db";
import { playlists } from "@repo/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { playlistUrl } = await request.json();
    
    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Playlist URL is required" },
        { status: 400 }
      );
    }

    // Check if the playlist exists in the database
    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .limit(1);
    
    return NextResponse.json({
      exists: existingPlaylist.length > 0,
    });
  } catch (error) {
    console.error("Error checking if course exists:", error);
    return NextResponse.json(
      { error: "Failed to check if course exists" },
      { status: 500 }
    );
  }
}
