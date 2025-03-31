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
    <div className="bg-card dark:bg-card/90 rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg border border-border">
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
        <h3 className="font-semibold text-foreground dark:text-white text-lg mb-1 line-clamp-1">
          {playlist.title}
        </h3>
        <p className="text-foreground/80 dark:text-card-foreground text-sm line-clamp-2 mb-3">
          {playlist.description}
        </p>

        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>{playlist.creator}</span>
          </div>
          <Badge variant="secondary" className="text-xs hover:bg-secondary/80">
            {playlist.category}
          </Badge>
        </div>
      </div>
    </div>
  );
}
