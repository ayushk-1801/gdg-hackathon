"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from './VideoPlayer';
import VideoSidebar from './VideoSidebar';
import QuizSection from './QuizSection';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { Video, Course } from '../../app/dashboard/courses/[courseid]/page';
import { authClient } from '@/lib/auth-client';

interface QuizQuestion {
  question: string;   // Changed from "q" to "question"
  options: string[];
  answer: string;
  explanation: string;
}

interface CourseViewerProps {
  courseId: string;
}

interface UserSession {
  id: string;
  email: string;
  name?: string;
}

export default function CourseViewer({ courseId }: CourseViewerProps) {
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

  // Add a state variable to control quiz visibility
  const [showQuiz, setShowQuiz] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  
  // Quiz related states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const router = useRouter();

  // Add global styles
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

  // Fetch user session on the frontend
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
    if (!userSession) return;
    
    const fetchCourseData = async () => {
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
        
        setCourse(courseData);
        
        // Set the first video as selected using our new handler
        if (courseData.remainingVideos.length > 0) {
          handleVideoSelection(courseData.remainingVideos[0]);
        } else if (courseData.completedVideos.length > 0) {
          handleVideoSelection(courseData.completedVideos[0]);
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
        } else {
          // Remove from completed, add to remaining
          newCompletedVideos = newCompletedVideos.filter(v => v.id !== selectedVideo.id);
          if (!newRemainingVideos.find(v => v.id === selectedVideo.id)) {
            newRemainingVideos.push({...selectedVideo, completed: false});
          }
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
    } finally {
      setIsUpdating(false);
    }
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

  // Loading state
  if (isLoading || !userSession) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
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
        {selectedVideo ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
            </div>
            
            <VideoPlayer 
              selectedVideo={selectedVideo} 
              onVideoComplete={handleVideoComplete}
              isUpdating={isUpdating}
              showQuiz={showQuiz}
              setShowQuiz={setShowQuiz}
            />
            
            {/* Quiz Section */}
            {showQuiz && (
              <QuizSection 
                quizQuestions={quizQuestions}
                quizLoading={quizLoading}
                selectedAnswers={selectedAnswers}
                submittedAnswers={submittedAnswers}
                showExplanations={showExplanations}
                currentQuestionIndex={currentQuestionIndex}
                setSelectedAnswers={setSelectedAnswers}
                setSubmittedAnswers={setSubmittedAnswers}
                setShowExplanations={setShowExplanations}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                setShowQuiz={setShowQuiz}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a video to start learning</p>
          </div>
        )}
      </div>

      {/* Sidebar (now on the right) */}
      <VideoSidebar 
        course={course}
        selectedVideo={selectedVideo}
        onVideoSelect={handleVideoSelection}
      />
    </div>
  );
}
