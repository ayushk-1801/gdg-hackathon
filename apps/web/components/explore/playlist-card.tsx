import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, User } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  creator: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  viewCount: number;
  category: string;
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
      <div className="relative aspect-video">
        <Image
          src={playlist.thumbnail || "/placeholder.svg"}
          alt={playlist.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center text-white">
          <PlayCircle className="h-5 w-5 mr-1.5" />
          <span className="text-sm">{playlist.videoCount} videos</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
          {playlist.title}
        </h3>
        <div className="flex items-center text-slate-400 text-sm mb-2">
          <User className="h-3.5 w-3.5 mr-1" />
          <span>{playlist.creator}</span>
        </div>
        <p className="text-slate-300 text-sm line-clamp-2 mb-3">
          {playlist.description}
        </p>

        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>{formatNumber(playlist.viewCount)} views</span>
          <Badge className="bg-blue-600 hover:bg-blue-700 text-xs">
            {playlist.category}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
