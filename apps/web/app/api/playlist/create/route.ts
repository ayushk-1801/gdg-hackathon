import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db";
import { playlists } from "@repo/db/schema";
import { eq } from "drizzle-orm";

function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match && match[1] ? match[1] : null;
}

async function fetchPlaylistDetails(playlistId: string): Promise<{
  title: string;
  thumbnail: string;
  description: string;
  creator: string;
  videoCount: number;
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY not set in environment variables");
    return {
      title: "Untitled Playlist",
      thumbnail: "",
      description: "",
      creator: "",
      videoCount: 0,
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const playlist = data.items[0];
      const thumbnails = playlist.snippet.thumbnails;
      const thumbnail =
        thumbnails.maxres?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url ||
        "";

      return {
        title: playlist.snippet.title || "Untitled Playlist",
        thumbnail,
        description: playlist.snippet.description || "",
        creator: playlist.snippet.channelTitle || "",
        videoCount: playlist.contentDetails?.itemCount || 0,
      };
    }

    return {
      title: "Untitled Playlist",
      thumbnail: "",
      description: "",
      creator: "",
      videoCount: 0,
    };
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    return {
      title: "Untitled Playlist",
      thumbnail: "",
      description: "",
      creator: "",
      videoCount: 0,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { playlistUrl } = await req.json();

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "Missing playlist URL" },
        { status: 400 }
      );
    }

    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid YouTube playlist URL" },
        { status: 400 }
      );
    }

    const existingPlaylist = await db
      .select()
      .from(playlists)
      .where(eq(playlists.playlist_link, playlistUrl))
      .execute();

    let playlistUuid;

    if (existingPlaylist && existingPlaylist.length > 0) {
      playlistUuid = existingPlaylist[0]?.id ?? '';

      return NextResponse.json({
        exists: true,
        message: "Playlist already exists in the database",
        playlistId: playlistUuid,
      });
    }

    const { title, thumbnail, description, creator, videoCount } =
      await fetchPlaylistDetails(playlistId);

    playlistUuid = crypto.randomUUID();

    await db
      .insert(playlists)
      .values({
        id: playlistUuid,
        playlist_link: playlistUrl,
        title,
        thumbnail,
        description,
        creator,
        videoCount,
        category: "",
      })
      .execute();

    return NextResponse.json({
      success: true,
      message: "Playlist added to database",
      playlistId: playlistUuid,
    });
  } catch (error: any) {
    console.error("Error creating playlist:", error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
