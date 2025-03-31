"use client";

import { useState, useEffect } from "react";
import { PlaylistCard } from "@/components/explore/playlist-card";

export default function PlaylistGrid({
  playlists,
}: {
  playlists: Array<{
    id: string;
    title: string;
    creator: string;
    description: string;
    thumbnail: string;
    videoCount: number;
    viewCount: number;
    category: string;
  }>;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 rounded-lg overflow-hidden animate-pulse h-[320px]"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
