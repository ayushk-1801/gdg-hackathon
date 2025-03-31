"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { YouTubePlaylist } from "@/types";

interface ConfigureCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistData: YouTubePlaylist | null;
  selectedVideos: Set<number>;
  onSelectVideo: (index: number) => void;
  onSelectAll: () => void;
  onBack: () => void;
  onGenerate: () => void;
  loading: boolean;
  calculateTotalDuration: () => string;
}

export function ConfigureCourseDialog({
  open,
  onOpenChange,
  playlistData,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
  onBack,
  onGenerate,
  loading,
  calculateTotalDuration,
}: ConfigureCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden flex flex-col flex-1"
        >
          <DialogHeader className="mb-4">
            <DialogTitle>Configure Your Course</DialogTitle>
            <DialogDescription>
              Review and customize the course before generating
            </DialogDescription>
          </DialogHeader>

          {playlistData && (
            <div className="space-y-6 overflow-hidden flex-1 flex flex-col">
              <div className="flex flex-col gap-1.5 w-full mb-4 pb-3 border-b">
                <Label htmlFor="course-title" className="font-medium">
                  Course Title
                </Label>
                <Input
                  id="course-title"
                  defaultValue={playlistData.title}
                  className="text-base"
                  placeholder="Enter a title for your course"
                />
              </div>
              
              <div className="flex gap-4 flex-shrink-0">
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
                <div className="flex-1 min-w-0 flex flex-col">
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
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between flex-shrink-0">
                    <h3 className="font-medium">Videos in Playlist</h3>
                    <Button variant="outline" size="sm" onClick={onSelectAll}>
                      {selectedVideos.size === playlistData.videos.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    <div className="space-y-2 pb-2">
                      {playlistData.videos.map((video, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 rounded-md border p-2 ${
                            selectedVideos.has(index) ? "bg-muted/40" : ""
                          }`}
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
                              onClick={() => onSelectVideo(index)}
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
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between border-t pt-6 mt-4 flex-shrink-0">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
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
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
