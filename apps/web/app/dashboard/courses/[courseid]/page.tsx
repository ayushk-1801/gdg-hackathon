import { redirect } from 'next/navigation';
import CourseViewer from '../../../../components/course-page/CourseViewer';
import { authClient } from '@/lib/auth-client';

export interface Video {
  id: string;
  title: string;
  url: string;
  videoId: string;
  summary: string;
  completed: boolean;
  thumbnail?: string;
  quizzes?: QuizQuestion[];
  refLinks?: ResourceLink[];
}

export interface ResourceLink {
  title: string;
  url: string;
  type?: string;
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

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const CoursePage = async ({ params }: { params: Promise<{ courseid: string }> }) => {
  const courseId = (await params).courseid;
  
  return (
    <CourseViewer courseId={courseId} />
  );
}

export default CoursePage;