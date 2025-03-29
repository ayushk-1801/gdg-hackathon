"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check, Loader2, InfoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateCoursePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [playlistData, setPlaylistData] = useState<null | {
    title: string;
    creator: string;
    videoCount: number;
    thumbnail: string;
    videos: Array<{
      title: string;
      thumbnail: string;
      duration: string;
    }>;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to fetch playlist data
    setTimeout(() => {
      setPlaylistData({
        title: "Complete Web Development Bootcamp",
        creator: "Programming with Mosh",
        videoCount: 45,
        thumbnail: "/placeholder.svg?height=200&width=350",
        videos: [
          {
            title: "Course Introduction",
            thumbnail: "/placeholder.svg?height=80&width=120",
            duration: "8:45",
          },
          {
            title: "Setting Up Your Development Environment",
            thumbnail: "/placeholder.svg?height=80&width=120",
            duration: "15:20",
          },
          {
            title: "Web Development Overview",
            thumbnail: "/placeholder.svg?height=80&width=120",
            duration: "12:15",
          },
          {
            title: "HTML Document Structure",
            thumbnail: "/placeholder.svg?height=80&width=120",
            duration: "18:30",
          },
          {
            title: "HTML Elements and Attributes",
            thumbnail: "/placeholder.svg?height=80&width=120",
            duration: "22:10",
          },
        ],
      });
      setLoading(false);
      setStep(2);
      setConfigDialogOpen(true);
    }, 2000);
  };

  const handleGenerate = () => {
    setLoading(true);

    // Simulate course generation
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      setConfigDialogOpen(false);
      setSuccessDialogOpen(true);
    }, 3000);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setConfigDialogOpen(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="flex-1 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Step 1: URL Input directly on page (not in dialog) */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="space-y-8 text-center max-w-3xl w-full px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What YouTube playlist
                <br />
                do you want to transform?
              </h1>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="mx-auto max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Web Development
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Data Science
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Machine Learning
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Design
                </Button>
              </motion.div>

              <motion.div
                className="mt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <InfoIcon className="h-4 w-4 mr-1" />
                        Supported URL formats
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center" className="max-w-base p-4">
                      <div className="text-sm">
                        <p className="font-medium mb-2">Supported YouTube URL formats:</p>
                        <ul className="space-y-1">
                          <li>https://www.youtube.com/playlist?list=PLAYLIST_ID</li>
                          <li>https://youtube.com/playlist?list=PLAYLIST_ID</li>
                          <li>https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </motion.form>
          </motion.div>
        )}

        {/* Configure Course Dialog (Step 2) */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader>
                <DialogTitle>Configure Your Course</DialogTitle>
                <DialogDescription>
                  Review and customize the course before generating
                </DialogDescription>
              </DialogHeader>

              {playlistData && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-32 w-56 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={playlistData.thumbnail || "/placeholder.svg"}
                        alt={playlistData.title}
                        className="object-cover"
                        width={224}
                        height={128}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{playlistData.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {playlistData.creator}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {playlistData.videoCount} videos
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Label htmlFor="course-title" className="text-xs">
                          Course Title
                        </Label>
                        <Input
                          id="course-title"
                          defaultValue={playlistData.title}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="videos">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="videos" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Videos in Playlist</h3>
                          <Button variant="outline" size="sm">
                            Select All
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {playlistData.videos.map((video, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 rounded-md border p-2"
                            >
                              <div className="h-12 w-20 overflow-hidden rounded bg-muted">
                                <Image
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  className="object-cover"
                                  width={80}
                                  height={48}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium">
                                  {video.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {video.duration}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="summary-length">Summary Length</Label>
                          <Select defaultValue="standard">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select summary length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="brief">
                                Brief (1-2 paragraphs)
                              </SelectItem>
                              <SelectItem value="standard">
                                Standard (3-4 paragraphs)
                              </SelectItem>
                              <SelectItem value="detailed">
                                Detailed (5+ paragraphs)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quiz-questions">
                            Quiz Questions Per Video
                          </Label>
                          <Select defaultValue="3">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select number of questions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 questions</SelectItem>
                              <SelectItem value="3">3 questions</SelectItem>
                              <SelectItem value="5">5 questions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="advanced" className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Summary Language</Label>
                          <Select defaultValue="english">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Quiz Difficulty</Label>
                          <Select defaultValue="beginner">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <DialogFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Course
                    </>
                  ) : (
                    <>
                      Generate Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog (Step 3) */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader className="text-center">
                <motion.div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check className="h-6 w-6 text-primary" />
                </motion.div>
                <DialogTitle className="text-xl">
                  Course Created Successfully!
                </DialogTitle>
                <DialogDescription>
                  Your course has been generated and is ready to use
                </DialogDescription>
              </DialogHeader>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="mx-auto max-w-md rounded-lg border bg-muted/50 p-4">
                  <h3 className="font-semibold">
                    Complete Web Development Bootcamp
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    45 videos • 10h 45m
                  </p>
                  <div className="mt-4 flex justify-between text-sm">
                    <span>Summaries</span>
                    <span className="font-medium text-primary">Generated</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Quizzes</span>
                    <span className="font-medium text-primary">Generated</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Key Points</span>
                    <span className="font-medium text-primary">Generated</span>
                  </div>
                </div>
              </motion.div>

              <DialogFooter className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/courses/1">View Course</Link>
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </AuroraBackground>
  );
}
