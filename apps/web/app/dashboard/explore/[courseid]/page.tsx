"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
}

interface Course {
  id: string;
  playlist_link: string;
  title: string;
  creator: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  viewCount: number;
  category: string;
  videos: Video[];
}

export default function ExploreCourse({
  params,
}: {
  params: { courseid: string };
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const { data: session } = await authClient.getSession();
        
        // Include userId in query params if session exists
        const queryParams = session?.user?.id 
          ? `?userId=${session.user.id}` 
          : '';

        const res = await fetch(`/api/explore/${params.courseid}${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await res.json();
        setCourse(data.course);
        setIsEnrolled(data.isEnrolled);
        if (data.isEnrolled) {
          setEnrollmentId(data.enrollmentId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.courseid) {
      fetchCourse();
    }
  }, [params.courseid]);

  const handleEnrollment = async () => {
    try {
      const { data: session } = await authClient.getSession();
      
      if (!session?.user) {
        alert("Please sign in to enroll in courses");
        return;
      }

      if (!course) {
        return;
      }

      // Use the /courses/enroll route for enrollment
      const res = await fetch('/api/courses/enroll', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistUrl: course.playlist_link,
          userId: session.user.id,
          userEmail: session.user.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to enroll");
      }

      const data = await res.json();
      
      // Handle the enrollment response
      if (data.status === "enrolled" || data.status === "existing") {
        setIsEnrolled(true);
        setEnrollmentId(data.enrollment.id);
      } else {
        throw new Error(data.error || "Failed to enroll");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToCourse = () => {
    if (enrollmentId) {
      router.push(`/dashboard/learn/${enrollmentId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-8 w-3/4 max-w-2xl mt-2" />
          <Skeleton className="h-5 w-40 mt-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <Skeleton className="aspect-video w-full mb-4" />
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-5/6 mb-1" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2">
                      <Skeleton className="h-12 w-20 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mt-4">The course you are looking for does not exist.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Go back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        
        <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
        <p className="text-muted-foreground">By {course.creator}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardContent className="">
              <div className="aspect-video relative mb-4">
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                )}
              </div>
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">
                  About this course
                </h3>
                <p>{course.description}</p>
              </div>
            </CardContent>
            <CardFooter>
              {isEnrolled ? (
                <Button onClick={goToCourse} className="w-full">
                  Go to Course
                </Button>
              ) : (
                <Button onClick={handleEnrollment} className="w-full">
                  Enroll in Course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Course Content</CardTitle>
              <CardDescription>{course.videoCount} videos</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <ul className="space-y-2">
                {course.videos &&
                  course.videos.map((video) => (
                    <li
                      key={video.id}
                      className="p-2 hover:bg-secondary rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-12 w-20 flex-shrink-0">
                          <Image
                            src={
                              video.thumbnail || "/thumbnail-placeholder.png"
                            }
                            alt={video.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                          />
                        </div>
                        <span className="text-sm truncate">{video.title}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
