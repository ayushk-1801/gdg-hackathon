"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addVideoJob } from "@/lib/queue-client";

function Page() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleAddVideoToQueue = async () => {
    try {
      setLoading(true);
      setStatus("Adding video to queue...");
      
      // Hardcoded YouTube video URL - this is a sample educational video
      const youtubeVideoUrl = "https://www.youtube.com/watch?v=8L10w1KoOU8";
      
      const result = await addVideoJob(youtubeVideoUrl);
      console.log("Job added:", result);
      setStatus(`Success! Video added to queue. Job ID: ${result?.id || "Unknown"}`);
    } catch (error) {
      console.error("Failed to add video job:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">YouTube Video Processing</h1>
      
      <div className="mb-6">
        <Button
          onClick={handleAddVideoToQueue}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Add YouTube Video to Queue"}
        </Button>
        
        {status && (
          <div className={`mt-4 p-3 rounded ${status.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
            {status}
          </div>
        )}
      </div>
      
      <div className="border p-4 rounded bg-gray-50">
        <h2 className="font-medium mb-2">Video Information:</h2>
        <p><strong>URL:</strong> https://www.youtube.com/watch?v=8L10w1KoOU8</p>
        <p className="text-gray-600 text-sm mt-2">
          This button sends a hardcoded YouTube video URL to the processing queue.
          The worker will extract the transcript, generate a summary, and create multiple choice questions.
        </p>
      </div>
    </div>
  );
}

export default Page;
