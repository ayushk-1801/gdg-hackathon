"use client";

import { FeedbackDialog } from "@/components/nav/feedback-dialog";
import { FeedbackButton } from "@/components/nav/feedback-button";
import { Toaster } from "sonner";

interface FeedbackProviderProps {
  children: React.ReactNode;
  showFloatingButton?: boolean;
}

export function FeedbackProvider({
  children,
  showFloatingButton = true,
}: FeedbackProviderProps) {
  return (
    <>
      {children}
      
      {/* Include the feedback dialog in the layout */}
      <FeedbackDialog />
      
      {/* Floating feedback button */}
      {showFloatingButton && (
        <div className="fixed bottom-6 right-6 z-50">
          <FeedbackButton 
            variant="default" 
            size="lg"
            className="shadow-lg"
          />
        </div>
      )}
      
      {/* Toast notifications */}
      <Toaster position="top-right" />
    </>
  );
} 