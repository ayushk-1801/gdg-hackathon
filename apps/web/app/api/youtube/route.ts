import { NextResponse } from 'next/server';

// Define types for the YouTube API response
interface YouTubeVideo {
  title: string;
  thumbnail: string;
  duration: string;
  videoId: string;
}

interface YouTubePlaylist {
  title: string;
  creator: string;
  videoCount: number;
  thumbnail: string;
  videos: YouTubeVideo[];
}

// Format the ISO 8601 duration to a readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function GET(request: Request) {
  // Get the playlist ID from the query parameter
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  // Get the API key from environment variables
  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY || API_KEY === 'your_youtube_api_key_here') {
    return NextResponse.json(
      { error: 'YouTube API key is not configured. Please set a valid API key in .env.local file.' }, 
      { status: 500 }
    );
  }

  try {    
    // Fetch playlist details
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}));
      console.error('YouTube API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to fetch playlist data: ${errorData?.error?.message || playlistResponse.statusText}` }, 
        { status: playlistResponse.status }
      );
    }
    
    const playlistData = await playlistResponse.json();
    
    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }
    
    const playlistInfo = playlistData.items[0].snippet;
    
    // Fetch playlist items (videos)
    const playlistItemsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
    );
    
    if (!playlistItemsResponse.ok) {
      const errorData = await playlistItemsResponse.json().catch(() => ({}));
      console.error('YouTube API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to fetch playlist items: ${errorData?.error?.message || playlistItemsResponse.statusText}` }, 
        { status: playlistItemsResponse.status }
      );
    }
    
    const playlistItemsData = await playlistItemsResponse.json();
    
    // Extract video IDs for content details (duration) request
    const videoIds = playlistItemsData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(',');
    
    // Fetch video details for durations
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json().catch(() => ({}));
      console.error('YouTube API Error:', errorData);
      return NextResponse.json(
        { error: `Failed to fetch video details: ${errorData?.error?.message || videoDetailsResponse.statusText}` }, 
        { status: videoDetailsResponse.status }
      );
    }
    
    const videoDetailsData = await videoDetailsResponse.json();
    
    // Map durations to videos
    const durationMap = new Map();
    videoDetailsData.items.forEach((item: any) => {
      durationMap.set(item.id, formatDuration(item.contentDetails.duration));
    });
    
    // Build the response
    const videos = playlistItemsData.items.map((item: any) => {
      const videoId = item.snippet.resourceId.videoId;
      return {
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: durationMap.get(videoId) || '00:00',
        videoId
      };
    });
    
    const response: YouTubePlaylist = {
      title: playlistInfo.title,
      creator: playlistInfo.channelTitle,
      videoCount: videos.length,
      thumbnail: playlistInfo.thumbnails.high?.url || 
                playlistInfo.thumbnails.medium?.url || 
                playlistInfo.thumbnails.default?.url,
      videos
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist data. Please ensure you have a valid YouTube API key and the playlist exists.' }, 
      { status: 500 }
    );
  }
}
