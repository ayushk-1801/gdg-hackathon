"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { YouTubePlaylist } from "@/types";

interface ConfigureCourseFormProps {
  playlistData: YouTubePlaylist | null;
  selectedVideos: Set<number>;
  onSelectVideo: (index: number) => void;
  onSelectAll: () => void;
  onBack: () => void;
  onGenerate: () => void;
  loading: boolean;
  calculateTotalDuration: () => string;
}

export function ConfigureCourseForm({
  playlistData,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
  onBack,
  onGenerate,
  loading,
  calculateTotalDuration,
}: ConfigureCourseFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Configure Your Course</h1>
        <p className="text-muted-foreground mt-2">
          Review and customize the course before generating
        </p>
      </div>

      {playlistData && (
        <div className="space-y-8">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="course-title" className="font-medium text-lg">
              Course Title
            </Label>
            <Input
              id="course-title"
              defaultValue={playlistData.title}
              className="text-base h-12"
              placeholder="Enter a title for your course"
            />
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-5 flex gap-5">
            <div className="h-32 w-56 overflow-hidden rounded-md bg-muted flex-shrink-0">
              <Image
                src={playlistData.thumbnail || "/placeholder.svg"}
                alt={playlistData.title}
                className="object-cover h-full w-full"
                width={224}
                height={128}
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-semibold text-base line-clamp-2" title={playlistData.title}>
                Source Playlist: {playlistData.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={playlistData.creator}>
                {playlistData.creator}
              </p>
              <p className="text-sm text-muted-foreground">
                {playlistData.videoCount} videos • {calculateTotalDuration()}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Videos in Playlist</h3>
              <Button variant="outline" size="sm" onClick={onSelectAll}>
                {selectedVideos.size === playlistData.videos.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {playlistData.videos.map((video, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
                      selectedVideos.has(index) ? "bg-muted/40" : "hover:bg-muted/20"
                    }`}
                    onClick={() => onSelectVideo(index)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="h-12 w-20 overflow-hidden rounded bg-muted flex-shrink-0">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt=""
                        className="object-cover"
                        width={80}
                        height={48}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium" title={video.title}>
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.duration}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Button 
                        variant={selectedVideos.has(index) ? "default" : "ghost"} 
                        size="sm" 
                        className="h-8 w-8 p-0"
                      >
                        <Check className={`h-4 w-4 ${selectedVideos.has(index) ? "opacity-100" : "opacity-30"}`} />
                        <span className="sr-only">
                          {selectedVideos.has(index) ? "Deselect" : "Select"}
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button variant="outline" size="lg" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              size="lg"
              onClick={onGenerate} 
              disabled={loading || (selectedVideos.size === 0)}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Course
                </>
              ) : (
                <>
                  Generate Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
