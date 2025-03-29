"use client";

import React from "react";

export function AuroraBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full w-full bg-background relative flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-full w-full relative">
          {/* Gradients */}
          <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-400 opacity-20 blur-3xl" />
          <div className="absolute top-[20%] right-[30%] h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-20 blur-3xl" />
          <div className="absolute bottom-[10%] left-[30%] h-[600px] w-[600px] rounded-full bg-blue-500 opacity-20 blur-3xl" />
          <div className="absolute bottom-[20%] right-[15%] h-[300px] w-[300px] rounded-full bg-cyan-400 opacity-20 blur-3xl" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
