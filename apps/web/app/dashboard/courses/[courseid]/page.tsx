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
  // Define the globalStyles constant at the top level of the component
  const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  `;

  // Move this useEffect to be with the other useEffects at the top
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Add a state variable to control quiz visibility
  const [showQuiz, setShowQuiz] = useState(false);

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
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
        // Reset current question index when loading new questions
        setCurrentQuestionIndex(0);
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
      // Reset current question index when loading new questions
      setCurrentQuestionIndex(0);
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
    setCurrentQuestionIndex(0);
    // Hide the quiz when changing videos
    setShowQuiz(false);
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

  // Function to go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Function to go to the previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
                {!showQuiz && (
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      setShowQuiz(true);
                      // Still keep the API logic for the separate page
                      // router.push(`/dashboard/courses/${courseId}/quiz/${selectedVideo.id}`);
                    }}
                  >
                    Take a Quiz
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant={selectedVideo.completed ? "destructive" : "default"}
                  onClick={() => handleVideoComplete(!selectedVideo.completed)}
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
            
            {/* Quiz Questions Section - Only shown when showQuiz is true */}
            {showQuiz && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Practice Quiz
                </h3>
                
                {quizLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                ) : quizQuestions && quizQuestions.length > 0 ? (
                  <div>
                    {/* Quiz Progress Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {quizQuestions.length}
                      </div>
                      <div className="w-2/3 bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300 ease-out" 
                          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
                      </div>
                    </div>
                    
                    {/* Display Current Question */}
                    {quizQuestions[currentQuestionIndex] && (
                      <Card className={`
                        ${submittedAnswers[currentQuestionIndex] === true ? 'border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
                        ${submittedAnswers[currentQuestionIndex] === false ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                        shadow-md transition-all duration-300 animate-fadeIn
                      `}>
                        <CardHeader>
                          <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                          <CardDescription className="text-base font-medium text-foreground mt-1">
                            {quizQuestions[currentQuestionIndex].question}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <RadioGroup 
                            value={selectedAnswers[currentQuestionIndex]} 
                            onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                            className="space-y-3"
                          >
                            {quizQuestions[currentQuestionIndex].options.map((option, i) => (
                              <div 
                                key={i} 
                                className={`
                                  flex items-center space-x-3 p-3 rounded-md transition-all 
                                  ${submittedAnswers[currentQuestionIndex] !== undefined && option === quizQuestions[currentQuestionIndex].answer ? 
                                    'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500/40' : ''}
                                  ${submittedAnswers[currentQuestionIndex] === false && option === selectedAnswers[currentQuestionIndex] ? 
                                    'bg-red-100 dark:bg-red-900/30 ring-2 ring-red-500/40' : ''}
                                  ${submittedAnswers[currentQuestionIndex] === undefined ? 
                                    'hover:bg-secondary/70 cursor-pointer border border-border hover:border-primary/30' : 
                                    'cursor-default'}
                                `}
                                onClick={() => {
                                  if (submittedAnswers[currentQuestionIndex] === undefined) {
                                    handleAnswerSelect(currentQuestionIndex, option);
                                  }
                                }}
                              >
                                <div className="flex items-center justify-center">
                                  <RadioGroupItem 
                                    value={option} 
                                    id={`q${currentQuestionIndex}-option${i}`}
                                    disabled={submittedAnswers[currentQuestionIndex] !== undefined}
                                  />
                                </div>
                                <Label 
                                  htmlFor={`q${currentQuestionIndex}-option${i}`}
                                  className={`
                                    flex-grow cursor-pointer select-none text-base
                                    ${submittedAnswers[currentQuestionIndex] !== undefined && option === quizQuestions[currentQuestionIndex].answer ? 
                                      'font-semibold text-green-700 dark:text-green-400' : ''}
                                    ${submittedAnswers[currentQuestionIndex] === false && option === selectedAnswers[currentQuestionIndex] ? 
                                      'text-red-700 dark:text-red-400' : ''}
                                  `}
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          
                          {/* Show explanation after answering */}
                          {showExplanations[currentQuestionIndex] && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm animate-fadeIn">
                              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Explanation
                              </h4>
                              <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                                {quizQuestions[currentQuestionIndex].explanation}
                              </p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="py-3 flex flex-wrap sm:flex-row gap-3 justify-between items-center border-t">
                          <div className="flex items-center gap-2">
                            {submittedAnswers[currentQuestionIndex] === undefined ? (
                              <Button 
                                onClick={() => handleSubmitAnswer(currentQuestionIndex)}
                                disabled={!selectedAnswers[currentQuestionIndex]}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Submit Answer
                              </Button>
                            ) : (
                              <div></div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousQuestion}
                              disabled={currentQuestionIndex === 0}
                              className="px-2 py-1 h-9"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Previous
                            </Button>

                            <Button 
                              variant={submittedAnswers[currentQuestionIndex] !== undefined ? "default" : "outline"}
                              size="sm"
                              onClick={goToNextQuestion}
                              disabled={currentQuestionIndex === quizQuestions.length - 1}
                              className={`
                                px-2 py-1 h-9
                                ${submittedAnswers[currentQuestionIndex] !== undefined ? 
                                  'bg-primary hover:bg-primary/90' : ''}
                              `}
                            >
                              Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    )}
        
                    
                    {/* Quiz Summary - Show when all questions are answered */}
                    {Object.keys(submittedAnswers).length === quizQuestions.length && (
                      <div className="mt-8 p-5 bg-muted/30 rounded-lg border border-border animate-fadeIn">
                        <h3 className="text-lg font-semibold mb-3">Quiz Summary</h3>
                        <p className="mb-4">
                          You answered {Object.values(submittedAnswers).filter(Boolean).length} out of {quizQuestions.length} questions correctly.
                        </p>
                        <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000 ease-out" 
                            style={{ 
                              width: `${(Object.values(submittedAnswers).filter(Boolean).length / quizQuestions.length) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            variant="outline"
                            className="text-primary border-primary hover:bg-primary/10"
                            onClick={() => {
                              setSelectedAnswers({});
                              setSubmittedAnswers({});
                              setShowExplanations({});
                              setCurrentQuestionIndex(0);
                            }}
                          >
                            Restart Quiz
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 bg-muted rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-muted-foreground font-medium">No quiz questions available for this video yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">Select another video or check back later!</p>
                  </div>
                )}
              </div>
            )}
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