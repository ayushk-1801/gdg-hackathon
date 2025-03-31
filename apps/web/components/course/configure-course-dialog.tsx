"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Check,
  Loader2,
  Settings,
  Sparkles,
  Info,
  ArrowLeft,
  User,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { YouTubePlaylist } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfigureCourseFormProps {
  playlistData: YouTubePlaylist | null;
  selectedVideos: Set<number>;
  onSelectVideo: (index: number) => void;
  onSelectAll: () => void;
  onGenerate: () => void;
  onBack: () => void; // Added prop for back button functionality
  loading: boolean;
  calculateTotalDuration: () => string;
}

export function ConfigureCourseForm({
  playlistData,
  selectedVideos,
  onSelectVideo,
  onSelectAll,
  onGenerate,
  onBack, // Added parameter
  loading,
  calculateTotalDuration,
}: ConfigureCourseFormProps) {
  const [courseSettings, setCourseSettings] = useState({
    includeQuizzes: true,
    includeProjects: true,
    difficultyLevel: "intermediate",
    generationStyle: "comprehensive",
  });

  const handleSettingsChange = (key: string, value: any) => {
    setCourseSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl mx-auto px-4 h-[calc(100vh-120px)]"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Configure Your Course
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and customize the course before generating
        </p>
      </div>

      {playlistData && (
        <div className="flex gap-6 h-[calc(100%-80px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-5 flex gap-5">
                <div className="h-32 w-56 overflow-hidden rounded-md bg-muted flex-shrink-0">
                  <Image
                    src={playlistData.thumbnail || "/placeholder.svg"}
                    alt={playlistData.title}
                    className="object-cover h-full w-full"
                    width={224}
                    height={128}
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h3
                    className="font-semibold text-lg line-clamp-2"
                    title={playlistData.title}
                  >
                    {playlistData.title}
                  </h3>
                  <div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <p
                        className="text-sm text-muted-foreground truncate"
                        title={playlistData.creator}
                      >
                        {playlistData.creator}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Youtube className="h-3.5 w-3.5 mr-1" />

                      <p className="text-sm text-muted-foreground">
                        {playlistData.videoCount} videos •{" "}
                        {calculateTotalDuration()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg">Videos in Playlist</h3>
                  <Button variant="outline" size="sm" onClick={onSelectAll}>
                    {selectedVideos.size === playlistData.videos.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {playlistData.videos.map((video, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
                          selectedVideos.has(index)
                            ? "bg-muted/40"
                            : "hover:bg-muted/20"
                        }`}
                        onClick={() => onSelectVideo(index)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="h-12 w-20 overflow-hidden rounded bg-muted flex-shrink-0">
                          <Image
                            src={video.thumbnail || "/placeholder.svg"}
                            alt=""
                            className="object-cover"
                            width={80}
                            height={48}
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="truncate text-sm font-medium"
                            title={video.title}
                          >
                            {video.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {video.duration}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            variant={
                              selectedVideos.has(index) ? "default" : "ghost"
                            }
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Check
                              className={`h-4 w-4 ${selectedVideos.has(index) ? "opacity-100" : "opacity-30"}`}
                            />
                            <span className="sr-only">
                              {selectedVideos.has(index)
                                ? "Deselect"
                                : "Select"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Customization Options */}
          <div className="w-96 flex-shrink-0 border-l pl-5">
            <div className="h-full flex flex-col overflow-hidden">
              <div className="overflow-y-auto pr-2 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-medium">Customization</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p className="text-xs">
                          These settings help customize your course generation.
                          You can always edit the content after generation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Course Difficulty
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className={`rounded-md cursor-pointer transition  hover:bg-muted/30 border ${
                            courseSettings.difficultyLevel === "beginner"
                              ? "border-2 bg-muted border-emerald-500 hover:border-emerald-600"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleSettingsChange("difficultyLevel", "beginner")
                          }
                        >
                          <div className="text-center space-y-1 p-2">
                            <p className="text-xs font-medium">Beginner</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              For newcomers
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-md cursor-pointer transition hover:bg-muted/30 border ${
                            courseSettings.difficultyLevel === "intermediate"
                              ? "border-2 bg-muted border-blue-500 hover:border-blue-600"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleSettingsChange(
                              "difficultyLevel",
                              "intermediate"
                            )
                          }
                        >
                          <div className="text-center space-y-1 p-2">
                            <p className="text-xs font-medium">Intermediate</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              Some experience
                            </p>
                          </div>
                        </div>
                        <div
                          className={`rounded-md cursor-pointer transition hover:bg-muted/30 border ${
                            courseSettings.difficultyLevel === "advanced"
                              ? "border-2 bg-muted border-purple-500 hover:border-purple-600"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleSettingsChange("difficultyLevel", "advanced")
                          }
                        >
                          <div className="text-center space-y-1 p-2">
                            <p className="text-xs font-medium">Advanced</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              Expert level
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Generation Style
                      </Label>
                      <div className="space-y-2">
                        <div
                          className={`rounded-md border p-3 cursor-pointer transition hover:border-primary/50 hover:bg-muted/30 ${
                            courseSettings.generationStyle === "concise"
                              ? "bg-muted border-primary"
                              : ""
                          }`}
                          onClick={() =>
                            handleSettingsChange("generationStyle", "concise")
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-1 h-12 rounded-full bg-primary flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">Concise</p>
                              <p className="text-xs text-muted-foreground">
                                Brief and to-the-point content focused on key
                                concepts
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-md border p-3 cursor-pointer transition hover:border-primary/50 hover:bg-muted/30 ${
                            courseSettings.generationStyle === "comprehensive"
                              ? "bg-muted border-primary"
                              : ""
                          }`}
                          onClick={() =>
                            handleSettingsChange(
                              "generationStyle",
                              "comprehensive"
                            )
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-1 h-12 rounded-full bg-primary flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">
                                Comprehensive
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Balanced coverage with examples and explanations
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`rounded-md border p-3 cursor-pointer transition hover:border-primary/50 hover:bg-muted/30 ${
                            courseSettings.generationStyle === "detailed"
                              ? "bg-muted border-primary"
                              : ""
                          }`}
                          onClick={() =>
                            handleSettingsChange("generationStyle", "detailed")
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-1 h-12 rounded-full bg-primary flex-shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium">Detailed</p>
                              <p className="text-xs text-muted-foreground">
                                In-depth coverage with thorough explanations and
                                context
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between items-center">
                  {/* Back Button */}
                  <Button
                    size={"lg"}
                    variant="outline"
                    onClick={onBack}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {/* Generate Button */}
                  <Button
                    size="lg"
                    onClick={onGenerate}
                    disabled={loading || selectedVideos.size === 0}
                    className="flex-1 ml-4"
                  >
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
