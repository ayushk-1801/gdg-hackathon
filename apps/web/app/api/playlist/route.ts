import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db";
import { playlists } from "@repo/db/schema";
import { eq } from "drizzle-orm";

function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match && match[1] ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const playlistUrl = url.searchParams.get("url");

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Missing playlist URL" },
        { status: 400 }
      );
    }

    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .execute();

    return NextResponse.json({
      exists: existingPlaylist.length > 0,
      playlistId: existingPlaylist.length > 0 ? existingPlaylist[0]?.id : null,
    });
  } catch (error: any) {
    console.error("Error checking playlist:", error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
