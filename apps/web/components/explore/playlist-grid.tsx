"use client";

import { useState, useEffect } from "react";
import { PlaylistCard } from "@/components/explore/playlist-card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card dark:bg-card/90 rounded-lg overflow-hidden border border-border">
            <Skeleton className="aspect-video w-full rounded-none rounded-t-lg" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
              <Skeleton className="h-4 w-full mb-1 rounded-sm" />
              <Skeleton className="h-4 w-2/3 mb-3 rounded-sm" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4 rounded-sm" />
                <Skeleton className="h-4 w-1/5 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
}
