"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CourseNotFound() {
  const router = useRouter();
  
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
