"use client";

import type React from "react";
import { motion } from "framer-motion";
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
import { ConfigureCourseForm } from "@/components/course/configure-course-dialog";
import { SuccessDialog } from "@/components/course/success-dialog";
import { ArrowRight } from "lucide-react";
import { useCourseCreationStore } from "@/stores/course-creation-store";
import { useRouter } from "next/navigation";

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
    successDialogOpen,
    playlistData,
    selectedVideos,
    setUrl,
    handleSubmit,
    toggleVideoSelection,
    handleSelectAll,
    handleGenerate,
    handleBack,
    setSuccessDialogOpen,
    calculateTotalDuration,
  } = useCourseCreationStore();

  // Function to navigate to explore page with search query
  const navigateToExplore = (categoryName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set("q", categoryName);
    router.push(`/dashboard/explore?${searchParams.toString()}`);
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
              onSubmit={handleSubmit}
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

              <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <InfoIcon className="h-4 w-4 mr-1" />
                        Supported URL formats
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="center"
                      className="max-w-base"
                    >
                      <div className="text-sm">
                        <p className="font-medium mb-2">
                          Supported YouTube URL formats:
                        </p>
                        <ul className="">
                          <li>
                            https://www.youtube.com/playlist?list=PLAYLIST_ID
                          </li>
                          <li>https://youtube.com/playlist?list=PLAYLIST_ID</li>
                          <li>
                            https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
                          </li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </motion.form>
          </motion.div>
        )}

        {/* Step 2: Configure Course Form directly on the page */}
        {step === 2 && playlistData && (
          <div className="flex-1">
            <ConfigureCourseForm
              playlistData={playlistData}
              selectedVideos={selectedVideos}
              onSelectVideo={toggleVideoSelection}
              onSelectAll={handleSelectAll}
              onBack={handleBack}
              onGenerate={handleGenerate}
              loading={loading}
              calculateTotalDuration={calculateTotalDuration}
            />
          </div>
        )}

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
