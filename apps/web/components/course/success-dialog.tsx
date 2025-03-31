"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  videoCount: number;
  totalDuration: string;
}

export function SuccessDialog({
  open,
  onOpenChange,
  courseTitle,
  videoCount,
  totalDuration,
}: SuccessDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">
              Generating Your Course
            </DialogTitle>
            <DialogDescription>
              We're preparing your learning materials in the background
            </DialogDescription>
          </DialogHeader>

          <motion.div
            className="my-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="rounded-lg border bg-muted/50 p-5">
              <h3 className="font-semibold line-clamp-2 text-base" title={courseTitle}>
                {courseTitle || "YouTube Course"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {videoCount} videos • {totalDuration}
              </p>
              
              <div className="mt-4 space-y-2">
                {renderGeneratingStatus("Summaries")}
                {renderGeneratingStatus("Quizzes")}
                {renderGeneratingStatus("Useful Links")}
                {renderGeneratingStatus("Course Structure")}
              </div>
            </div>
          </motion.div>

          <DialogFooter className="flex flex-col sm:flex-row justify-center gap-3 mt-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/courses/1?view=generation">
                View Generation Progress
              </Link>
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
