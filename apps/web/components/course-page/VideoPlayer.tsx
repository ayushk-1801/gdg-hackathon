"use client";
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Video } from '../../app/dashboard/courses/[courseid]/page';

interface VideoPlayerProps {
  selectedVideo: Video;
  onVideoComplete: (completed: boolean) => Promise<void>;
  isUpdating: boolean;
  showQuiz: boolean;
  setShowQuiz: (show: boolean) => void;
}

export default function VideoPlayer({
  selectedVideo,
  onVideoComplete,
  isUpdating,
  showQuiz,
  setShowQuiz
}: VideoPlayerProps) {
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Function to handle video errors
  const handleVideoError = () => {
    console.error("Error loading video");
    setVideoError(true);
  };

  // Function to retry loading the video
  const retryVideo = () => {
    setVideoError(false);
    if (videoRef.current) {
      // Reload iframe by updating its src
      videoRef.current.src = selectedVideo?.url || '';
    }
  };

  // Function to handle video load success
  const handleVideoLoad = () => {
    console.log("Video loaded successfully!");
    setVideoError(false);
  };
  
  return (
    <>
      <div className="flex flex-col">
        {!videoError ? (
          <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              ref={videoRef}
              src={selectedVideo.url}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              onError={handleVideoError}
              onLoad={handleVideoLoad}
            ></iframe>
          </div>
        ) : (
          <div className="w-full bg-card flex items-center justify-center rounded-lg" style={{ height: "500px" }}>
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-4">Failed to load video</p>
              <p className="text-sm text-muted-foreground mb-4">URL: {selectedVideo.url}</p>
              <Button onClick={retryVideo} className="mb-2">Retry</Button>
              <div className="mt-2">
                <a 
                  href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Open on YouTube
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!showQuiz && (
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowQuiz(true)}
            >
              Take a Quiz
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant={selectedVideo.completed ? "destructive" : "default"}
            onClick={() => onVideoComplete(!selectedVideo.completed)}
            disabled={isUpdating}
          >
            {selectedVideo.completed ? "Mark as Not Done" : "Mark as Done"}
          </Button>
        </div>
        
        {showQuiz && (
          <Button 
            variant="outline"
            onClick={() => setShowQuiz(false)}
          >
            Hide Quiz
          </Button>
        )}
      </div>
      
      {/* Video Summary */}
      <div className="mt-4 px-4 py-3 bg-card rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-muted-foreground">Summary</h3>
        <p className="text-card-foreground">{selectedVideo.summary}</p>
      </div>
    </>
  );
}
