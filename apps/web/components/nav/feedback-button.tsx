"use client";

import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useFeedbackStore } from "@/stores/feedback-store";
import { SmilePlus } from "lucide-react";

interface FeedbackButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export function FeedbackButton({
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
  label = "Feedback",
}: FeedbackButtonProps) {
  const { open } = useFeedbackStore();

  const handleClick = useCallback(() => {
    open();
  }, [open]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {showIcon && <SmilePlus className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
} 