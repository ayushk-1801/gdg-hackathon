"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface EnrollmentButtonProps {
  isEnrolled: boolean;
  enrollmentId: string | null;
  course: {
    playlist_link: string;
  };
}

export function EnrollmentButton({ isEnrolled: initialIsEnrolled, enrollmentId: initialEnrollmentId, course }: EnrollmentButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(initialIsEnrolled);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(initialEnrollmentId);
  const router = useRouter();

  const handleEnrollment = async () => {
    try {
      const { data: session } = await authClient.getSession();
      
      if (!session?.user) {
        alert("Please sign in to enroll in courses");
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

  return isEnrolled ? (
    <Button onClick={goToCourse} className="w-full">
      Go to Course
    </Button>
  ) : (
    <Button onClick={handleEnrollment} className="w-full">
      Enroll in Course
    </Button>
  );
}
