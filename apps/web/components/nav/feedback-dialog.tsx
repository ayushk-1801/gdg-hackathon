"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, SmilePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeedbackStore } from "@/stores/feedback-store";

const formSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please select a rating.",
  }),
  comment: z
    .string()
    .min(5, {
      message: "Comment must be at least 5 characters.",
    })
    .max(500, {
      message: "Comment cannot exceed 500 characters.",
    }),
});

export function FeedbackDialog() {
  const { isOpen, close } = useFeedbackStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      form.reset();
      setCharCount(0);
      close();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharCount(value.length);
    form.setValue("comment", value);
  };

  // Emoji mapping for ratings
  const ratingEmojis = {
    "1": "😞",
    "2": "🙁",
    "3": "😐",
    "4": "🙂",
    "5": "😄",
  };

  // Rating descriptions
  const ratingDescriptions = {
    "1": "Very Dissatisfied",
    "2": "Dissatisfied",
    "3": "Neutral",
    "4": "Satisfied",
    "5": "Very Satisfied",
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px] p-6 gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <SmilePlus className="h-6 w-6 text-primary" />
            Share your feedback
          </DialogTitle>
          <DialogDescription className="text-base">
            Help us improve our product with your valuable feedback. Your
            insights matter to us!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback category</FormLabel>
                  <FormDescription>
                    What aspect of our product are you providing feedback on?
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ui">User Interface</SelectItem>
                      <SelectItem value="features">Features</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="bugs">Bug Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>How would you rate your experience?</FormLabel>
                  <FormDescription>
                    Select an emoji that best represents your experience
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap justify-between gap-2 sm:gap-0"
                    >
                      {Object.entries(ratingEmojis).map(([rating, emoji]) => (
                        <FormItem
                          key={rating}
                          className="flex flex-col items-center space-y-2 flex-1 min-w-[60px]"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={rating}
                              className="sr-only"
                              id={`rating-${rating}`}
                            />
                          </FormControl>
                          <label
                            htmlFor={`rating-${rating}`}
                            className={`
                              h-14 w-14 rounded-full flex items-center justify-center text-2xl cursor-pointer
                              border-2 transition-all duration-200 hover:scale-110
                              ${
                                field.value === rating
                                  ? "border-primary bg-primary/10 scale-110"
                                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                              }
                            `}
                          >
                            {emoji}
                          </label>
                          <span className="text-xs text-center text-muted-foreground">
                            {
                              ratingDescriptions[
                                rating as keyof typeof ratingDescriptions
                              ]
                            }
                          </span>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Your feedback</FormLabel>
                    <span
                      className={`text-xs ${charCount > 450 ? "text-amber-500" : "text-muted-foreground"} ${charCount >= 500 ? "text-destructive" : ""}`}
                    >
                      {charCount}/500
                    </span>
                  </div>
                  <FormDescription>
                    Please share your thoughts, suggestions, or concerns
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think..."
                      className="resize-none min-h-[120px] focus-visible:ring-primary"
                      {...field}
                      onChange={handleCommentChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                className="transition-all duration-200 hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit feedback"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
