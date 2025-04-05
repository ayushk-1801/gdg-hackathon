"use client";

import Image from "next/image";

interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
}

export default function CourseVideos({ videos }: { videos: Video[] }) {
  return (
    <ul className="space-y-2">
      {videos && videos.map((video) => (
        <li key={video.id} className="p-2 hover:bg-secondary rounded-md">
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-20 flex-shrink-0">
              <Image
                src={video.thumbnail || "/thumbnail-placeholder.png"}
                alt={video.title}
                fill
                style={{objectFit: "cover"}}
                className="rounded"
              />
            </div>
            <span className="text-sm truncate">{video.title}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
