"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, Bug, CheckCircle, Circle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export interface Video {
  id: string;
  title: string;
  url: string;
  videoId: string;
  summary: string;
  completed: boolean;
}

export interface Course {
  courseId: string;
  title: string;
  creator: string;
  completedVideos: Video[];
  remainingVideos: Video[];
  enrollment: {
    id: string;
    progress: number;
    enrolledAt: string;
    completedAt: string | null;
  };
}

interface UserSession {
  id: string;
  email: string;
  name?: string;
}

const CoursePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseid as string;

  // Get user session first
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        
        if (!session?.user?.id) {
          router.push('/login');
          return;
        }
        
        setUserSession({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        });
      } catch (err) {
        console.error('Error fetching user session:', err);
        router.push('/login');
      }
    };
    
    fetchUserSession();
  }, [router]);

  // Fetch course data after we have the user session
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!userSession) return;
      
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/courses/${courseId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userSession.id,
            userEmail: userSession.email
          })
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          
          if (response.status === 403) {
            router.push('/dashboard/courses');
            return;
          }
          
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch course data');
        }
        
        const courseData = await response.json();
        
        // Log the course data for debugging
        console.log("Course data received:", {
          title: courseData.title,
          completedVideos: courseData.completedVideos?.length || 0,
          remainingVideos: courseData.remainingVideos?.length || 0, 
          debug: courseData.debug
        });
        
        // Log full video details
        console.log("Completed videos:", courseData.completedVideos);
        console.log("Remaining videos:", courseData.remainingVideos);
        
        // Sample a video URL if available for inspection
        if (courseData.remainingVideos?.length > 0) {
          console.log("Sample video URL:", courseData.remainingVideos[0].url);
        }
        
        setCourse(courseData);
        
        // Set the first video as selected
        if (courseData.remainingVideos.length > 0) {
          setSelectedVideo(courseData.remainingVideos[0]);
        } else if (courseData.completedVideos.length > 0) {
          setSelectedVideo(courseData.completedVideos[0]);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, router, userSession]);

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

  // Function to mark video as completed or not
  const handleVideoComplete = async (completed = true) => {
    if (!userSession || !selectedVideo) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userSession.id,
          userEmail: userSession.email,
          videoId: selectedVideo.id,
          completed
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update progress');
      }
      
      const result = await response.json();
      
      // Update the selected video status
      if (selectedVideo) {
        setSelectedVideo({
          ...selectedVideo,
          completed
        });
      }
      
      // Update course progress in UI
      if (course) {
        // Move the video between completed/remaining lists
        let newCompletedVideos = [...course.completedVideos];
        let newRemainingVideos = [...course.remainingVideos];
        
        if (completed) {
          // Remove from remaining, add to completed
          newRemainingVideos = newRemainingVideos.filter(v => v.id !== selectedVideo.id);
          if (!newCompletedVideos.find(v => v.id === selectedVideo.id)) {
            newCompletedVideos.push({...selectedVideo, completed: true});
          }
          toast.success("Video marked as completed!");
        } else {
          // Remove from completed, add to remaining
          newCompletedVideos = newCompletedVideos.filter(v => v.id !== selectedVideo.id);
          if (!newRemainingVideos.find(v => v.id === selectedVideo.id)) {
            newRemainingVideos.push({...selectedVideo, completed: false});
          }
          toast.info("Video marked as not completed");
        }
        
        setCourse({
          ...course,
          completedVideos: newCompletedVideos,
          remainingVideos: newRemainingVideos,
          enrollment: {
            ...course.enrollment,
            progress: result.progress
          }
        });
      }
      
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error('Failed to update progress');
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to handle video load success
  const handleVideoLoad = () => {
    console.log("Video loaded successfully!");
    setVideoError(false);
  };

  // Toggle debug information panel
  const toggleDebug = () => {
    setShowDebugInfo(prev => !prev);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-3/4 p-4">
          <Skeleton className="h-96 w-4/5 mb-4" />
          <Skeleton className="h-40 w-4/5 mt-4" />
        </div>
        <div className="w-1/4 bg-background p-4">
          <Skeleton className="h-8 w-3/4 mb-4 bg-muted" />
          <Skeleton className="h-6 w-1/2 mb-2 bg-muted" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-10 w-full mb-2 bg-muted" />
          ))}
          <Skeleton className="h-6 w-1/2 mt-4 mb-2 bg-muted" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-10 w-full mb-2 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-warning/20 border border-warning text-warning-foreground px-4 py-3 rounded relative">
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Video Player (now on the left) */}
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          {selectedVideo && <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>}
          <Button variant="outline" size="sm" onClick={toggleDebug}>
            <Bug className="h-4 w-4 mr-2" /> Debug
          </Button>
        </div>
        
        {showDebugInfo && (
          <div className="mb-4 p-4 border border-warning bg-warning/20 text-warning-foreground rounded-md">
            <h3 className="font-bold mb-2">Debug Information</h3>
            <p>Videos found: {course?.completedVideos.length || 0} completed, {course?.remainingVideos.length || 0} remaining</p>
            
            {selectedVideo && (
              <>
                <h4 className="font-semibold mt-2">Current Video:</h4>
                <ul className="list-disc pl-5">
                  <li>ID: {selectedVideo.id}</li>
                  <li>Video ID: {selectedVideo.videoId}</li>
                  <li>Title: {selectedVideo.title}</li>
                  <li>URL: <pre className="bg-muted p-1 mt-1 overflow-x-auto">{selectedVideo.url}</pre></li>
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.videoId}`, '_blank')}
                >
                  Open in YouTube
                </Button>
              </>
            )}
          </div>
        )}
        
        {selectedVideo ? (
          <>
            <div className="flex items-center">
              {!videoError ? (
                <div className="w-4/5 relative" style={{ paddingBottom: "45%" }}>
                  <iframe
                    ref={videoRef}
                    src={selectedVideo.url}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    onError={handleVideoError}
                    onLoad={handleVideoLoad}
                  ></iframe>
                </div>
              ) : (
                <div className="w-4/5 bg-card flex items-center justify-center rounded-lg" style={{ height: "500px" }}>
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
              
              <div className="ml-4 flex flex-col space-y-2">
                {selectedVideo.completed ? (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={() => handleVideoComplete(false)}
                      disabled={isUpdating || !userSession}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleVideoComplete(false)}
                      disabled={isUpdating || !userSession}
                      size="sm"
                    >
                      Mark as not done
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => handleVideoComplete(true)}
                    disabled={isUpdating || !userSession}
                    className="flex items-center"
                  >
                    <Circle className="h-4 w-4 mr-2" />
                    Mark as Done
                  </Button>
                )}
              </div>
            </div>
            
            {/* Progress status bar */}
            <div className="mt-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{isNaN(course.enrollment.progress) ? 0 : course.enrollment.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ 
                    width: `${isNaN(course.enrollment.progress) ? 0 : course.enrollment.progress}%` 
                  }}
                ></div>
              </div>
            </div>
            
            {/* Video Summary */}
            <div className="mt-4 p-4 bg-card rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-muted-foreground">Summary</h3>
              <p className="text-card-foreground">{selectedVideo.summary}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a video to start learning</p>
          </div>
        )}
      </div>

      {/* Sidebar (now on the right) */}
      <div className="w-1/4 bg-card text-card-foreground p-4 overflow-y-auto border-l border-border">
        <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
        <div className="text-sm text-muted-foreground mb-4">
          Created by {course.creator} • {course.completedVideos.length + course.remainingVideos.length} videos
        </div>
        <div className="mb-4 bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${course.enrollment.progress}%` }}
          ></div>
        </div>

        {/* Completed Videos */}
        {course.completedVideos.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-muted-foreground">
              <CheckCircle className="inline-block mr-1 h-5 w-5" /> Completed ({course.completedVideos.length})
            </h3>
            <ul>
              {course.completedVideos.map((video) => (
                <li
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`cursor-pointer p-2 rounded-md mb-2 flex items-center ${
                    selectedVideo?.id === video.id ? "bg-primary text-primary-foreground" : "bg-secondary/50"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  <span className="truncate">{video.title}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Remaining Videos */}
        {course.remainingVideos.length > 0 && (
          <>
            <h3 className="text-lg font-medium text-muted-foreground mt-4">
              <Circle className="inline-block mr-1 h-5 w-5" /> Remaining ({course.remainingVideos.length})
            </h3>
            <ul>
              {course.remainingVideos.map((video) => (
                <li
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`cursor-pointer p-2 rounded-md mb-2 flex items-center ${
                    selectedVideo?.id === video.id ? "bg-primary text-primary-foreground" : "bg-secondary/50"
                  }`}
                >
                  <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{video.title}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default CoursePage;