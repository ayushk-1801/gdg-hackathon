"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfigureCourseForm } from "@/components/course/configure-course-dialog";
import { SuccessPage } from "@/components/course/success-dialog";
import { ArrowRight } from "lucide-react";
import { useCourseCreationStore } from "@/stores/course-creation-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Define popular course categories
const POPULAR_CATEGORIES = [
  { id: "dsa", name: "Data Structures & Algorithms" },
  { id: "web-dev", name: "Web Development" },
  { id: "data-science", name: "Data Science" },
  { id: "machine-learning", name: "Machine Learning" },
];

export default function CreateCoursePage() {
  const router = useRouter();

  const {
    url,
    loading,
    error,
    step,
    playlistData,
    courseId,
    setUrl,
    handleSubmit,
    handleGenerate,
    handleBack,
    calculateTotalDuration,
    resetState,
  } = useCourseCreationStore();

  // Reset to step 1 when component mounts if we're at step 3
  useEffect(() => {
    if (step === 3) {
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to redirect to course page when courseId is available
  useEffect(() => {
    if (courseId) {
      router.push(`/dashboard/courses/${courseId}`);
    }
  }, [courseId, router]);

  // Function to navigate to explore page with search query
  const navigateToExplore = (categoryName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("q", categoryName);
    router.push(`/dashboard/explore?${searchParams.toString()}`);
  };

  // Custom submit handler that wraps the store's handleSubmit
  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    // If courseId is set during handleSubmit, this will redirect via the useEffect
  };

  return (
    <AuroraBackground>
      <div className="container mx-auto py-12 min-h-screen flex flex-col">
        {/* Step 1: URL Input directly on page */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8 text-center max-w-3xl mx-auto w-full px-4 flex-1 flex flex-col justify-center"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Which YouTube playlist
              <br />
              do you want to transform?
            </h1>

            <motion.form
              onSubmit={onSubmit}
              className="mx-auto max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {POPULAR_CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => navigateToExplore(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </motion.div>
            </motion.form>
          </motion.div>
        )}

        {/* Step 2: Configure Course Form directly on the page */}
        {step === 2 && playlistData && (
          <div className="flex-1">
            {error && (
              <Alert variant="destructive" className="mb-4 max-w-3xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <ConfigureCourseForm
              playlistData={playlistData}
              onBack={handleBack}
              onGenerate={handleGenerate}
              loading={loading}
              calculateTotalDuration={calculateTotalDuration}
            />
          </div>
        )}

        {/* Step 3: Success Page */}
        {step === 3 && (
          <SuccessPage
            courseTitle={playlistData?.title || "YouTube Course"}
            videoCount={playlistData?.videos.length || 0}
            totalDuration={calculateTotalDuration()}
          />
        )}
      </div>
    </AuroraBackground>
  );
}
