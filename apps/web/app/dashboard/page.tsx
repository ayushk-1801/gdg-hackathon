"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { addVideoJob } from "@/lib/queue-client";

function Page() {
  return (
    <div>
      Page
      <Button
        onClick={() => {
          addVideoJob("123");
          console.log("Job added");
        }}
      >
        Click Me
      </Button>
    </div>
  );
}

export default Page;
