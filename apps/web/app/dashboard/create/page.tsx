"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, InfoIcon, AlertCircle } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfigureCourseDialog } from "@/components/course/configure-course-dialog";
import { SuccessDialog } from "@/components/course/success-dialog";
import { ArrowRight } from "lucide-react";
import { YouTubePlaylist } from "@/types";

// Function to extract playlist ID from a YouTube URL
function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match ? match[1] : null;
}

// Define popular course categories
const POPULAR_CATEGORIES = [
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "web-dev", name: "Web Development" },
  { id: "data-science", name: "Data Science" },
  { id: "machine-learning", name: "Machine Learning" }
];

export default function CreateCoursePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [playlistData, setPlaylistData] = useState<YouTubePlaylist | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<Set<number>>(new Set());

  const fetchYouTubePlaylist = async (playlistId: string): Promise<YouTubePlaylist> => {
    const response = await fetch(`/api/youtube?playlistId=${playlistId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch playlist data");
    }
    
    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Extract the playlist ID from the URL
      const playlistId = extractPlaylistId(url);
      
      if (!playlistId) {
        throw new Error("Invalid YouTube playlist URL. Please check the URL and try again.");
      }
      
      // Fetch the playlist data
      const data = await fetchYouTubePlaylist(playlistId);
      
      // Initialize all videos as selected
      const newSelectedVideos = new Set<number>();
      data.videos.forEach((_, index) => newSelectedVideos.add(index));
      setSelectedVideos(newSelectedVideos);
      
      setPlaylistData(data);
      setStep(2);
      setConfigDialogOpen(true);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the playlist.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVideoSelection = (index: number) => {
    const newSelectedVideos = new Set(selectedVideos);
    if (newSelectedVideos.has(index)) {
      newSelectedVideos.delete(index);
    } else {
      newSelectedVideos.add(index);
    }
    setSelectedVideos(newSelectedVideos);
  };

  const handleSelectAll = () => {
    if (!playlistData) return;
    
    const newSelectedVideos = new Set<number>();
    if (selectedVideos.size !== playlistData.videos.length) {
      // Select all if not all are selected
      playlistData.videos.forEach((_, index) => newSelectedVideos.add(index));
    }
    setSelectedVideos(newSelectedVideos);
  };

  const handleGenerate = () => {
    setLoading(true);

    // Simulate course generation
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      setConfigDialogOpen(false);
      setSuccessDialogOpen(true);
    }, 3000);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setConfigDialogOpen(false);
    }
  };

  // Calculate total duration if available
  const calculateTotalDuration = () => {
    if (!playlistData) return "0m";
    
    let totalMinutes = 0;
    
    playlistData.videos.forEach((video, index) => {
      if (selectedVideos.has(index)) {
        const parts = video.duration.split(':');
        if (parts.length === 2) {
          // MM:SS format
          totalMinutes += parseInt(parts[0]);
        } else if (parts.length === 3) {
          // HH:MM:SS format
          totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <AuroraBackground>
      <div className="flex-1 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Step 1: URL Input directly on page */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="space-y-8 text-center max-w-3xl w-full px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What YouTube playlist
                <br />
                do you want to transform?
              </h1>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="mx-auto max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/playlist?list=..."
                  className="h-16 px-5 py-6 text-lg rounded-xl pr-36 bg-background/80 backdrop-blur-sm border-2"
                  required
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 h-12 px-6 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      Transform
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {POPULAR_CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                ))}
              </motion.div>

              <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <InfoIcon className="h-4 w-4 mr-1" />
                        Supported URL formats
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center" className="max-w-base p-4">
                      <div className="text-sm">
                        <p className="font-medium mb-2">Supported YouTube URL formats:</p>
                        <ul className="space-y-1">
                          <li>https://www.youtube.com/playlist?list=PLAYLIST_ID</li>
                          <li>https://youtube.com/playlist?list=PLAYLIST_ID</li>
                          <li>https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </motion.form>
          </motion.div>
        )}

        {/* Configure Course Dialog Component (Step 2) */}
        <ConfigureCourseDialog
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          playlistData={playlistData}
          selectedVideos={selectedVideos}
          onSelectVideo={toggleVideoSelection}
          onSelectAll={handleSelectAll}
          onBack={handleBack}
          onGenerate={handleGenerate}
          loading={loading}
          calculateTotalDuration={calculateTotalDuration}
        />

        {/* Success Dialog Component (Step 3) */}
        <SuccessDialog
          open={successDialogOpen}
          onOpenChange={setSuccessDialogOpen}
          courseTitle={playlistData?.title || "YouTube Course"}
          videoCount={selectedVideos.size}
          totalDuration={calculateTotalDuration()}
        />
      </div>
    </AuroraBackground>
  );
}
