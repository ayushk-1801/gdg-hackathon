"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Bug, CheckCircle, Circle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface Video {
  id: string;
  title: string;
  url: string;
  videoId: string;
  summary: string;
  completed: boolean;
  thumbnail?: string;
  quizzes?: QuizQuestion[];
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

interface QuizQuestion {
  question: string;   // Changed from "q" to "question"
  options: string[];
  answer: string;
  explanation: string;
}

const CoursePage = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // Quiz related states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  
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
        
        // Set the first video as selected using our new handler
        if (courseData.remainingVideos.length > 0) {
          handleVideoSelection(courseData.remainingVideos[0]);
        } else if (courseData.completedVideos.length > 0) {
          handleVideoSelection(courseData.completedVideos[0]);
        }

        // Log the videos to debug quiz data
        if (courseData.remainingVideos?.length > 0) {
          console.log("First video quiz data:", courseData.remainingVideos[0].quizzes);
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

  // Function to fetch quiz questions from the video
  const fetchQuizQuestions = async (video: Video) => {
    if (!video) return;
    
    setQuizLoading(true);
    try {
      // Check if quizzes are already in the video object
      if (video.quizzes && Array.isArray(video.quizzes) && video.quizzes.length > 0) {
        console.log("Found quizzes in video object:", JSON.stringify(video.quizzes));
        setQuizQuestions(video.quizzes);
        setQuizLoading(false);
        return;
      }
      
      // If not, fetch them from the API
      const response = await fetch(`/api/courses/${courseId}/quiz/${video.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch quiz questions');
        setQuizQuestions([]);
        return;
      }
      
      const data = await response.json();
      console.log("Fetched quiz questions:", JSON.stringify(data.questions));
      setQuizQuestions(data.questions || []);
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      setQuizQuestions([]);
    } finally {
      setQuizLoading(false);
    }
  };
  
  // Update selected video and fetch quiz questions
  const handleVideoSelection = (video: Video) => {
    setSelectedVideo(video);
    // Reset quiz states
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setShowExplanations({});
    // Fetch quiz questions for this video
    fetchQuizQuestions(video);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };
  
  // Handle quiz submission for a single question
  const handleSubmitAnswer = (questionIndex: number) => {
    const selectedOption = selectedAnswers[questionIndex];
    const question = quizQuestions[questionIndex];
    
    if (!selectedOption || !question) return;
    
    const isCorrect = selectedOption === question.answer;
    
    setSubmittedAnswers(prev => ({
      ...prev,
      [questionIndex]: isCorrect
    }));
    
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: true
    }));
    
    if (isCorrect) {
      toast.success("Correct answer!");
    } else {
      toast.error("Incorrect answer!");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen">
        {/* Main content skeleton */}
        <div className="w-3/4 p-4">
          {/* Video title skeleton */}
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-2/3" />
          </div>
          
          {/* Video player skeleton */}
          <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
            <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg" />
          </div>
          
          {/* Action buttons skeleton */}
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Summary skeleton */}
          <div className="mt-4 p-4 bg-card rounded-lg">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="w-1/4 bg-card p-4 border-l border-border">
          <Skeleton className="h-7 w-4/5 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          
          {/* Progress bar skeleton */}
          <Skeleton className="h-2.5 w-full rounded-full mb-6" />
          
          {/* Video list section title */}
          <Skeleton className="h-6 w-1/2 mb-4" />
          
          {/* Video items */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-12 w-16 rounded flex-shrink-0" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
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
      <div className="w-3/4 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          {selectedVideo && <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>}
        
        </div>
        

        
        {selectedVideo ? (
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
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => router.push(`/dashboard/courses/${courseId}/quiz/${selectedVideo.id}`)}
                >
                  Take a Quiz
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={selectedVideo.completed ? "destructive" : "default"}
                  onClick={() => handleVideoComplete(!selectedVideo.completed)}
                  disabled={isUpdating}
                >
                  {selectedVideo.completed ? "Mark as Not Done" : "Mark as Done"}
                </Button>
              </div>
            </div>
            
            {/* Video Summary */}
            <div className="mt-4 px-4 py-3 bg-card rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-muted-foreground">Summary</h3>
              <p className="text-card-foreground">{selectedVideo.summary}</p>
            </div>
            
            {/* Quiz Questions Section - Updated */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Practice Quiz</h3>
              
              {quizLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </div>
              ) : quizQuestions && quizQuestions.length > 0 ? (
                <div className="space-y-6">
                  {quizQuestions.map((question, qIndex) => {
                    console.log(`Rendering question ${qIndex}:`, question);
                    return (
                    <Card key={qIndex} className={`
                      ${submittedAnswers[qIndex] === true ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
                      ${submittedAnswers[qIndex] === false ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
                    `}>
                      <CardHeader>
                        <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                        <CardDescription className="text-base font-medium">
                          {typeof question === 'object' && question.question ? question.question : "Question not available"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {question && question.options && Array.isArray(question.options) ? (
                          <RadioGroup 
                            value={selectedAnswers[qIndex]} 
                            onValueChange={(value) => handleAnswerSelect(qIndex, value)}
                            className="space-y-2"
                          >
                            {question.options.map((option, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={option} 
                                  id={`q${qIndex}-option${i}`}
                                  disabled={submittedAnswers[qIndex] !== undefined}
                                />
                                <Label 
                                  htmlFor={`q${qIndex}-option${i}`}
                                  className={`
                                    ${submittedAnswers[qIndex] !== undefined && option === question.answer ? 'text-green-600 font-semibold' : ''}
                                  `}
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <p className="text-muted-foreground">Options not available</p>
                        )}
                        
                        {/* Display explanation when answer is submitted */}
                        {showExplanations[qIndex] && question.explanation && (
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium">Explanation:</p>
                            <p className="text-sm">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        {submittedAnswers[qIndex] === undefined ? (
                          <Button 
                            onClick={() => handleSubmitAnswer(qIndex)}
                            disabled={!selectedAnswers[qIndex]}
                          >
                            Submit Answer
                          </Button>
                        ) : (
                          <div className="text-sm font-medium">
                            {submittedAnswers[qIndex] ? 
                              <p className="text-green-600">Correct! Good job!</p> : 
                              <p className="text-red-600">Incorrect. The correct answer is: {question.answer}</p>
                            }
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  )})}
                </div>
              ) : (
                <div className="p-6 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground">No quiz questions available for this video yet.</p>
                </div>
              )}
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

        {/* All Videos in Sequence */}
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Course Videos
        </h3>
        <ul>
          {[...course.completedVideos, ...course.remainingVideos]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((video) => (
              <li
                key={video.id}
                onClick={() => handleVideoSelection(video)}
                className={`cursor-pointer p-2 rounded-md mb-2 flex items-center group relative 
                  transition-all duration-200 ease-in-out
                  hover:translate-x-1 hover:shadow-md
                  ${
                    selectedVideo?.id === video.id
                      ? video.completed 
                        ? "bg-green-600/80 text-white ring-1 ring-green-500 shadow-sm" 
                        : "bg-primary text-primary-foreground ring-1 ring-primary shadow-sm"
                      : video.completed
                        ? "bg-green-100/80 text-foreground dark:bg-green-900/20 hover:bg-green-200/80 dark:hover:bg-green-800/30"
                        : "bg-secondary/50 hover:bg-secondary/70"
                  }`}
              >
                {/* Video thumbnail */}
                <div className="flex-shrink-0 mr-2 h-12 w-16 rounded overflow-hidden relative shadow-sm group-hover:shadow">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  
                  {/* Removed the "Done" button that was here */}
                </div>
                
                <div className="flex items-center min-w-0 flex-1">
                  <span className="break-words text-sm font-medium group-hover:font-semibold line-clamp-2">{video.title}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default CoursePage;