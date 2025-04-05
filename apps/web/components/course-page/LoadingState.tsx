"use client";
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState() {
  return (
    <div className="flex h-screen">
      {/* Main content skeleton */}
      <div className="w-3/4 p-4">
        {/* Video title skeleton */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-2/3" />
        </div>
        
        {/* Video player skeleton */}
        <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
          <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Summary skeleton */}
        <div className="mt-4 p-4 bg-card rounded-lg">
          <Skeleton className="h-5 w-24 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      
      {/* Sidebar skeleton */}
      <div className="w-1/4 bg-card p-4 border-l border-border">
        <Skeleton className="h-7 w-4/5 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        {/* Progress bar skeleton */}
        <Skeleton className="h-2.5 w-full rounded-full mb-6" />
        
        {/* Video list section title */}
        <Skeleton className="h-6 w-1/2 mb-4" />
        
        {/* Video items */}
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-12 w-16 rounded flex-shrink-0" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
