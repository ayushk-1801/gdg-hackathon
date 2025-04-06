"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCourseCreationStore } from "@/stores/course-creation-store";

interface SuccessPageProps {
  courseTitle: string;
  videoCount: number;
  totalDuration: string;
}

export function SuccessPage({
  courseTitle,
  videoCount,
  totalDuration,
}: SuccessPageProps) {
  const router = useRouter();
  const resetState = useCourseCreationStore((state) => state.resetState);
  const courseId = useCourseCreationStore((state) => state.courseId);
  
  // Navigation handlers - ONLY navigate when buttons are clicked
  const handleBackToDashboard = () => {
    resetState(); // Reset state before navigating
    router.push("/dashboard");
  };
  
  const handleViewProgress = () => {
    resetState(); // Reset state before navigating
    
    // Navigate to the specific course using the courseId from the store
    if (courseId) {
      router.push(`/dashboard/courses/${courseId}?view=generation`);
    } else {
      // Fallback in case courseId is not available
      router.push("/dashboard/courses?view=generation");
    }
  };
  
  // Render a generating status indicator
  const renderGeneratingStatus = (label: string, progress: number = 0) => (
    <div className="flex justify-between text-sm items-center">
      <span className="font-medium">{label}</span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Generating...
      </span>
    </div>
  );

  // No useEffect or other hooks that might cause auto-navigation

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 h-[calc(100vh-120px)]"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Generating Your Course
        </h1>
        <p className="text-muted-foreground mt-2">
          We're preparing your learning materials in the background
        </p>
      </div>

      <motion.div
        className="max-w-md mx-auto my-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="rounded-lg border bg-card/50 backdrop-blur-sm p-6">
          <h3 className="font-semibold line-clamp-2 text-lg" title={courseTitle}>
            {courseTitle || "YouTube Course"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {videoCount} videos • {totalDuration}
          </p>
          
          <div className="mt-6 space-y-3">
            {renderGeneratingStatus("Summaries")}
            {renderGeneratingStatus("Quizzes")}
            {renderGeneratingStatus("Useful Links")}
            {renderGeneratingStatus("Course Structure")}
          </div>
        </div>
      </motion.div>

      {/* Improved button placement with onClick handlers */}
      <div className="pt-4 mt-4 border-t max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
          <Button 
            className="flex-1"
            onClick={handleViewProgress}
          >
            View Progress
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
