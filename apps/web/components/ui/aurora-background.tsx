"use client";

import React, { useEffect, useState, useRef } from "react";

export function AuroraBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Using refs to hold elements for direct manipulation
  const purpleRef = useRef<HTMLDivElement>(null);
  const indigoRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const pinkRef = useRef<HTMLDivElement>(null);
  const violetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const position = (elapsed % 10000) / 10000; // Complete cycle every 10 seconds

      // Direct DOM manipulation for more reliable animation
      if (purpleRef.current) {
        purpleRef.current.style.transform = `
          translate(${Math.sin(position * Math.PI * 2) * 80}px, ${Math.cos(position * Math.PI * 2) * 80}px)
          rotate(${position * 360 * 0.8}deg)
          scale(${0.85 + Math.sin(position * Math.PI) * 0.2})
        `;
      }

      if (indigoRef.current) {
        indigoRef.current.style.transform = `
          translate(${Math.cos(position * Math.PI * 2) * 100}px, ${Math.sin(position * Math.PI * 2) * 70}px)
          rotate(${-position * 360 * 1.2}deg)
          scale(${0.8 + Math.cos(position * Math.PI * 2) * 0.25})
        `;
      }

      if (blueRef.current) {
        blueRef.current.style.transform = `
          translate(${Math.sin(position * Math.PI * 2 + 2) * 90}px, ${Math.cos(position * Math.PI * 2 + 2) * 60}px)
          rotate(${position * 360 * 0.5}deg)
          scale(${0.9 + Math.sin(position * Math.PI * 2 + 1) * 0.15})
        `;
      }

      if (cyanRef.current) {
        cyanRef.current.style.transform = `
          translate(${Math.cos(position * Math.PI * 2 + 4) * 120}px, ${Math.sin(position * Math.PI * 2 + 4) * 80}px)
          rotate(${-position * 360 * 0.7}deg)
          scale(${0.85 + Math.cos(position * Math.PI * 2 + 3) * 0.25})
        `;
      }

      if (pinkRef.current) {
        pinkRef.current.style.transform = `
          translate(${Math.sin(position * Math.PI * 2 + 1) * 70}px, ${Math.cos(position * Math.PI * 2 + 1) * 90}px)
          rotate(${position * 360 * 0.6}deg)
          scale(${0.8 + Math.sin(position * Math.PI * 2 + 2) * 0.2})
        `;
      }

      if (violetRef.current) {
        violetRef.current.style.transform = `
          translate(${Math.cos(position * Math.PI * 2 + 3) * 110}px, ${Math.sin(position * Math.PI * 2 + 3) * 60}px)
          rotate(${-position * 360 * 0.9}deg)
          scale(${0.75 + Math.cos(position * Math.PI * 2 + 4) * 0.3})
        `;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      className={`h-full w-full bg-background relative flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-full w-full relative">
          {/* Gradients - with refs instead of style-based transforms */}
          <div
            ref={purpleRef}
            className="absolute rounded-full bg-purple-400 opacity-30 blur-3xl"
            style={{
              top: "-10%",
              left: "20%",
              height: "500px",
              width: "500px",
            }}
          />
          <div
            ref={indigoRef}
            className="absolute rounded-full bg-indigo-500 opacity-30 blur-3xl"
            style={{
              top: "20%",
              right: "30%",
              height: "400px",
              width: "400px",
            }}
          />
          <div
            ref={blueRef}
            className="absolute rounded-full bg-blue-500 opacity-30 blur-3xl"
            style={{
              bottom: "10%",
              left: "30%",
              height: "600px",
              width: "600px",
            }}
          />
          <div
            ref={cyanRef}
            className="absolute rounded-full bg-cyan-400 opacity-30 blur-3xl"
            style={{
              bottom: "20%",
              right: "15%",
              height: "300px",
              width: "300px",
            }}
          />

          {/* Additional gradients */}
          <div
            ref={pinkRef}
            className="absolute rounded-full bg-pink-500 opacity-20 blur-3xl"
            style={{
              top: "40%",
              left: "10%",
              height: "350px",
              width: "350px",
            }}
          />
          <div
            ref={violetRef}
            className="absolute rounded-full bg-violet-500 opacity-20 blur-3xl"
            style={{
              top: "5%",
              right: "15%",
              height: "320px",
              width: "320px",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
