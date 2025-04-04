"use client";
import React, { useState, useEffect, useRef } from "react";


import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import quizData from "./sampledata";
import { set } from "date-fns";

export interface Question {
  id: number;  
  question: string;
  answers: string[];
  correctAnswer: string;}
export interface QuizDataType { 
  questions: Question[];
}
function Page() {
    const [quiz, setQuiz] = useState<QuizDataType>(quizData);
  const { state } = useSidebar(); // Use state instead of collapsed
  const isSidebarCollapsed = state === "collapsed";

  const [isSticky, setIsSticky] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [containerPosition, setContainerPosition] = useState({ right: 0 });


  // Track previous sidebar state to detect changes
  const prevSidebarStateRef = useRef(state);
  const [sidebarStateChanged, setSidebarStateChanged] = useState(false);

   

  // Effect to detect sidebar state changes
  useEffect(() => {
    if (prevSidebarStateRef.current !== state) {
      setSidebarStateChanged(true);

      // Reset flag after transition completes
      const timer = setTimeout(() => {
        setSidebarStateChanged(false);
      }, 300); // Match transition duration

      return () => clearTimeout(timer);
    }
    prevSidebarStateRef.current = state;
  }, [state]);

  // Handle scroll event to detect when to make search sticky
  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const bannerHeight = bannerRef.current.offsetHeight;
        setIsSticky(window.scrollY > bannerHeight - 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure container position and width on mount, resize, and sidebar state change
  useEffect(() => {
    const updateContainerPosition = () => {
      if (searchContainerRef.current) {
        const rect = searchContainerRef.current.getBoundingClientRect();
        const rightDistance = window.innerWidth - rect.right;
        setContainerPosition({ right: rightDistance });
        
      }

      // Calculate available content area for centering search bar
      if (isSticky) {
        const sidebarWidth = isSidebarCollapsed
          ? parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--sidebar-width-icon"
              ) || "3rem"
            )
          : parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--sidebar-width"
              ) || "16rem"
            );

        // Convert rem to pixels
        const remValue = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        const sidebarWidthPx = sidebarWidth * remValue;

        // Calculate the center point of the available area (excluding sidebar)
        const availableWidth = window.innerWidth - sidebarWidthPx;
        const centerPoint = sidebarWidthPx + availableWidth / 2;

        // Position the search bar centered in the available space
        
      }
    };

    updateContainerPosition();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerPosition();
    });

    window.addEventListener("resize", updateContainerPosition);
    document.addEventListener("scroll", updateContainerPosition);

    // Observe the sidebar for size changes
    const sidebarElement = document.querySelector('[data-slot="sidebar"]');
    if (sidebarElement) {
      resizeObserver.observe(sidebarElement);
    }

    return () => {
      window.removeEventListener("resize", updateContainerPosition);
      document.removeEventListener("scroll", updateContainerPosition);
      resizeObserver.disconnect();
    };
  }, [state, isSticky, isSidebarCollapsed]);

  //smaple quiz data


const handlerMark = (id:number) => {
      quiz.questions = quiz.questions.filter((question) => question.id !== id);
      // Update the state or perform any other action as needed 
      setQuiz({ ...quiz });

};  


  return (
    <div>
      {isSticky && (
        <div
          className="fixed top-0 right-0 z-40 bg-blue-800 shadow-md transition-all duration-300"
          style={{
            height: "65px",
            left: isSidebarCollapsed
              ? "var(--sidebar-width-icon, 3rem)"
              : "var(--sidebar-width, 16rem)",
            transition: "left 0.3s ease, opacity 0.3s ease",
          }}
        />
      )}

      <div
        id="banner"
        ref={bannerRef}
        className="w-full bg-gradient-to-br from-indigo-950 via-blue-800 to-blue-600 mb-10"
      >
        <div className="container mx-auto py-14 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-10 md:flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">
                Review Marked Questions
              </h1>
              <p className="text-blue-100">
                We all make mistakes, and it's not until we make mistakes that we learn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSticky && <div className="h-16 md:h-6"></div>}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {quiz.questions.map((question,idx)=>(
            <div key={question.id} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-black">{question.question}</h2>
                <ul className="list-disc pl-6">
                {question.answers.map((answer, index) => (
                    <li key={index} className="mb-2 text-black">
                    {answer}
                    </li>
                ))}
                </ul>
                <div className="mt-4 flex items-center justify-between">
                <p className="mt-4 text-sm text-gray-500">
                Correct Answer: {question.correctAnswer}
                </p>
                <Button variant={"secondary"} onClick={()=>handlerMark(question.id)}>Unmark</Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
