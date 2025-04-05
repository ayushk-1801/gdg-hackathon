import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { EnrollmentButton } from "../../../../components/explore-course/EnrollmentButton";
import CourseVideos from "../../../../components/explore-course/CourseVideos";
import CourseHeader from "../../../../components/explore-course/CourseHeader";
import CourseNotFound from "../../../../components/explore-course/CourseNotFound";

async function getCourseData(courseId: string, userId?: string) {
  try {
    // Include userId in query params if it exists
    const queryParams = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/explore/${courseId}${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error("Failed to fetch course");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return { course: null, isEnrolled: false, enrollmentId: null };
  }
}

export default async function ExploreCourse({
  params,
}: {
  params: Promise<{ courseid: string }>;
}) {
  const { courseid } = await params;
  const courseData = await getCourseData(courseid);
  const course = courseData.course;
  const isEnrolled = courseData.isEnrolled;
  const enrollmentId = courseData.enrollmentId;

  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="container mx-auto p-4">
      <CourseHeader title={course.title} creator={course.creator} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardContent className="">
              <div className="aspect-video relative mb-4">
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    style={{objectFit: "cover"}}
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
              <EnrollmentButton 
                isEnrolled={isEnrolled} 
                enrollmentId={enrollmentId} 
                course={course} 
              />
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
              <CourseVideos videos={course.videos} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
