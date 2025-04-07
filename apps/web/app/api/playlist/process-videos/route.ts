import { NextRequest, NextResponse } from "next/server";
import { addPlaylistVideosToQueue } from "@repo/queue";

export async function POST(req: NextRequest) {
  try {
    const { playlistUrl, playlistData, userId, userEmail, playlistId } = await req.json();

    if (!playlistUrl || !playlistData || !playlistId) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const selectedVideos = playlistData.videos.filter((_: any, index: number) =>
      playlistData.selectedIndices.includes(index)
    );

    const videoUrls = selectedVideos.map(
      (video: any) => `https://www.youtube.com/watch?v=${video.videoId}`
    );

    await addPlaylistVideosToQueue(videoUrls, playlistUrl, userId, {
      playlistLink: playlistUrl,
      playlistId: playlistId,
      userEmail: userEmail || undefined,
    });

    let enrollmentResult = null;
    if (userId && userEmail) {
      try {
        const enrollResponse = await fetch(
          new URL("/api/courses/enroll", req.url).toString(),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlistUrl,
              userId,
              userEmail,
            }),
          }
        );

        if (enrollResponse.ok) {
          enrollmentResult = await enrollResponse.json();
        } else {
          console.error(
            "Failed to enroll user in course:",
            await enrollResponse.text()
          );
        }
      } catch (enrollError) {
        console.error("Error enrolling user in course:", enrollError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Videos added to processing queue",
      videoCount: videoUrls.length,
      enrollment: enrollmentResult,
    });
  } catch (error: any) {
    console.error("Error processing videos:", error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
