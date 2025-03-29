"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, ChevronDown, Play, Pause } from "lucide-react";

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeVideo, setActiveVideo] = useState(0);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const course = courses.find((c) => c.id === params.id) || courses[0];

  const toggleLesson = (index: number) => {
    setExpandedLessons((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleVideoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex min-h-screen flex-col">
     

      <main className="container flex-1 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg bg-black relative">
              {isPlaying ? (
                <video
                  src={`/api/videos/${course.id}/${activeVideo}`}
                  poster={course.videos[activeVideo].thumbnail || "/placeholder.svg"}
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                ></video>
              ) : (
                <>
                  <img
                    src={course.videos[activeVideo].thumbnail || "/placeholder.svg"}
                    alt={course.videos[activeVideo].title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      size="icon" 
                      className="h-16 w-16 rounded-full"
                      onClick={toggleVideoPlay}
                    >
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold">
                {course.videos[activeVideo].title}
              </h1>
              <p className="text-muted-foreground">
                {course.creator} • {course.videos[activeVideo].duration}
              </p>

              <Tabs defaultValue="summary" className="mt-6">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="notes">My Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4 space-y-4">
                  <p>{course.videos[activeVideo].summary}</p>
                  <h3 className="text-lg font-semibold">Key Points</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {course.videos[activeVideo].keyPoints.map(
                      (point, index) => (
                        <li key={index}>{point}</li>
                      )
                    )}
                  </ul>
                </TabsContent>
                <TabsContent value="quiz" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Your Knowledge</CardTitle>
                      <CardDescription>
                        Answer these questions to check your understanding
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {course.videos[activeVideo].quiz.map(
                        (question, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="grid gap-2">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent"
                                >
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                                    {optIndex === question.correctAnswer && (
                                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                      <Button className="w-full">Submit Answers</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="notes" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Notes</CardTitle>
                      <CardDescription>
                        Your personal notes for this video
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type your notes here..."
                      />
                      <Button className="mt-4">Save Notes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="p-4">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-muted-foreground">
                {course.videos.length} videos • {course.duration}
              </p>
            </div>
            <div className="border-t">
              {course.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-b last:border-0">
                  <button
                    className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-accent"
                    onClick={() => toggleLesson(sectionIndex)}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedLessons.includes(sectionIndex) ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedLessons.includes(sectionIndex) && (
                    <div className="space-y-1 px-4 pb-4">
                      {section.videos.map((videoIndex) => {
                        const video = course.videos[videoIndex];
                        const isActive = activeVideo === videoIndex;
                        const isCompleted = videoIndex < activeVideo;

                        return (
                          <button
                            key={videoIndex}
                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                              isActive
                                ? "bg-accent font-medium"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => setActiveVideo(videoIndex)}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            <span className="flex-1 truncate">
                              {video.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {video.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const courses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    creator: "Programming with Mosh",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "10h 45m",
    progress: 65,
    sections: [
      {
        title: "Getting Started",
        videos: [0, 1, 2],
      },
      {
        title: "HTML Fundamentals",
        videos: [3, 4, 5],
      },
      {
        title: "CSS Basics",
        videos: [6, 7],
      },
    ],
    videos: [
      {
        title: "Course Introduction",
        duration: "8:45",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "This video introduces the course structure and what you'll learn throughout the web development bootcamp. The instructor explains the prerequisites and the projects you'll build.",
        keyPoints: [
          "Overview of course curriculum",
          "Required software and tools",
          "Learning path and expectations",
          "Introduction to web development fundamentals",
        ],
        quiz: [
          {
            question: "What is the main focus of this bootcamp?",
            options: [
              "Mobile app development",
              "Web development",
              "Game development",
              "Data science",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which of the following is NOT covered in this course?",
            options: ["HTML", "CSS", "JavaScript", "Swift"],
            correctAnswer: 3,
          },
        ],
      },
      {
        title: "Setting Up Your Development Environment",
        duration: "15:20",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "Learn how to set up your development environment with the necessary tools and software. The instructor guides you through installing a code editor, browser developer tools, and version control systems.",
        keyPoints: [
          "Installing VS Code and extensions",
          "Setting up Git and GitHub",
          "Browser developer tools overview",
          "Terminal/command line basics",
        ],
        quiz: [
          {
            question: "Which code editor is recommended in this course?",
            options: [
              "Sublime Text",
              "Visual Studio Code",
              "Notepad++",
              "Atom",
            ],
            correctAnswer: 1,
          },
          {
            question: "What is Git primarily used for?",
            options: [
              "Writing HTML",
              "Version control",
              "Styling web pages",
              "Running servers",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "Web Development Overview",
        duration: "12:15",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "This video provides a comprehensive overview of web development, explaining the difference between frontend and backend development, and how they work together to create web applications.",
        keyPoints: [
          "Frontend vs. Backend development",
          "Client-server architecture",
          "Web technologies overview",
          "Modern web development workflow",
        ],
        quiz: [
          {
            question: "Which of these is a frontend technology?",
            options: ["Node.js", "MongoDB", "CSS", "Python"],
            correctAnswer: 2,
          },
          {
            question: "What happens on the server side of web development?",
            options: [
              "Rendering user interfaces",
              "Processing data and business logic",
              "Styling elements",
              "Animation effects",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "HTML Document Structure",
        duration: "18:30",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "Learn about the fundamental structure of HTML documents, including doctype declarations, head and body sections, and semantic elements that form the backbone of web pages.",
        keyPoints: [
          "HTML document boilerplate",
          "DOCTYPE declaration",
          "Head and body sections",
          "Semantic HTML elements",
        ],
        quiz: [
          {
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Hyperlink and Text Markup Language",
              "Home Tool Markup Language",
            ],
            correctAnswer: 0,
          },
          {
            question:
              "Which tag is used to define the main content area of an HTML document?",
            options: ["<header>", "<main>", "<content>", "<section>"],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "HTML Elements and Attributes",
        duration: "22:10",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "This video covers HTML elements and attributes in detail, showing how to use various tags to structure content and add functionality to web pages.",
        keyPoints: [
          "Block vs. inline elements",
          "Text formatting tags",
          "Links and navigation",
          "Images and multimedia",
          "Forms and input elements",
        ],
        quiz: [
          {
            question:
              "Which attribute is used to specify the URL of a linked resource?",
            options: ["src", "href", "link", "url"],
            correctAnswer: 1,
          },
          {
            question: "Which HTML element is used to create a dropdown list?",
            options: ["<input>", "<dropdown>", "<select>", "<option>"],
            correctAnswer: 2,
          },
        ],
      },
      {
        title: "HTML Forms and Validation",
        duration: "25:45",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "Learn how to create interactive HTML forms, implement client-side validation, and understand the different types of form controls available in HTML5.",
        keyPoints: [
          "Form structure and attributes",
          "Input types and attributes",
          "Form validation techniques",
          "Handling form submission",
          "Accessibility considerations",
        ],
        quiz: [
          {
            question: "Which input type is used for password fields?",
            options: ["text", "password", "secure", "hidden"],
            correctAnswer: 1,
          },
          {
            question: "What attribute makes a form field required?",
            options: ["mandatory", "required", "necessary", "important"],
            correctAnswer: 1,
          },
        ],
      },
      {
        title: "CSS Selectors and Properties",
        duration: "20:15",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "This video introduces CSS selectors and properties, explaining how to target HTML elements and apply styling to create visually appealing web pages.",
        keyPoints: [
          "CSS syntax fundamentals",
          "Element, class, and ID selectors",
          "Attribute and pseudo-class selectors",
          "Specificity and the cascade",
          "Common CSS properties",
        ],
        quiz: [
          {
            question: "Which selector targets elements with a specific class?",
            options: ["#name", ".name", "*name", "name[]"],
            correctAnswer: 1,
          },
          {
            question: "What CSS property is used to change text color?",
            options: ["text-color", "font-color", "color", "text-style"],
            correctAnswer: 2,
          },
        ],
      },
      {
        title: "CSS Box Model and Layout",
        duration: "28:30",
        thumbnail: "/placeholder.svg?height=200&width=350",
        summary:
          "Learn about the CSS box model and how it affects layout, including margins, padding, borders, and content areas. The video also covers different positioning methods and layout techniques.",
        keyPoints: [
          "Content, padding, border, and margin",
          "Box-sizing property",
          "Display properties",
          "Position properties",
          "Flexbox and Grid basics",
        ],
        quiz: [
          {
            question:
              "Which CSS property sets the space between an element's border and its content?",
            options: ["margin", "padding", "spacing", "border-spacing"],
            correctAnswer: 1,
          },
          {
            question:
              "What value of the 'position' property makes an element positioned relative to the viewport?",
            options: ["relative", "absolute", "fixed", "static"],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
];
