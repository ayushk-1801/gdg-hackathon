"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Youtube, CheckCircle, Shield, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { Spotlight } from "@/components/ui/spotlight-new";
import { YoutubeTranscript } from 'youtube-transcript';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);


  YoutubeTranscript.fetchTranscript('https://youtu.be/8L10w1KoOU8?si=mueMlZ5rfZihuZ3V').then(console.log);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-zinc-950 dark:via-black dark:to-zinc-950 text-zinc-900 dark:text-white relative">
      {/* Spotlight effect positioned behind everything */}
      <div className="absolute inset-0 overflow-hidden">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(350, 100%, 85%, .08) 0, hsla(350, 100%, 55%, .04) 50%, hsla(350, 100%, 45%, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(350, 100%, 85%, .08) 0, hsla(350, 100%, 55%, .04) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(350, 100%, 85%, .06) 0, hsla(350, 100%, 45%, .02) 80%, transparent 100%)"
          translateY={-50}
          xOffset={100}
          duration={8}
        />
      </div>

      <Navbar />

      <main className="px-4 md:px-8 lg:px-20 xl:px-40 relative">
        {/* Announcement Banner */}
        <div className="w-full flex justify-center pt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-xl bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-sm px-2 py-1 text-xs sm:text-sm shadow-lg border border-slate-200/50 dark:border-zinc-800/50"
          >
            <span className="mr-3 rounded-sm bg-rose-600 px-1.5 py-0.5 text-xs font-medium text-white">
              New
            </span>
            <span className="mr-3">
              AI-powered course generation ready to use
            </span>
            <ArrowRightIcon size={11} className="-mr-1 rounded-full" />
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="py-10 md:py-10 relative z-10">
          <div className="mx-auto max-w-5xl text-center space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400"
            >
              Transform YouTube content
              <br className="mt-2" />
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-2 block">
                into engaging courses
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed"
            >
              The best learning platforms in the AI era aren't solo
              experiences—they're collaborative. Benkyoshi provides customizable
              pre-built features to make your courses engaging, interactive, and
              AI-ready.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-14 flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 px-6 sm:px-10 py-5 sm:py-7 text-sm sm:text-base shadow-lg shadow-rose-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose-600/30"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white px-6 sm:px-10 py-5 sm:py-7 text-sm sm:text-base backdrop-blur-sm transition-all duration-300"
                >
                  Explore courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-16 sm:mt-24 relative"
          >
            <div className="w-full overflow-hidden rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-rose-600/10">
              <video
                autoPlay
                loop
                muted
                controls
                playsInline
                className="w-full h-auto object-contain rounded-xl bg-gray-600"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-28  border-slate-200 dark:border-zinc-800/50"
        >
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400">
                Transform YouTube learning.
              </h2>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Benkyoshi provides powerful tools to transform YouTube content
                into
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  structured educational experiences{" "}
                </span>
                with AI-enhanced features for deeper learning in a 
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  distraction-free environment
                </span>.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className=" backdrop-blur-sm p-8 border-r border-b border-slate-200 dark:border-zinc-800/50"
              >
                <h3 className="text-xl font-bold mb-2">
                  YouTube Playlist Import
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Convert any YouTube playlist into an organized learning
                  experience.
                </p>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Youtube className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold">Simple URL Import</div>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        Paste any YouTube playlist link
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="backdrop-blur-sm p-8 border-l border-b border-slate-200 dark:border-zinc-800/50"
              >
                <h3 className="text-xl font-bold mb-2">
                  Interactive Course Structure
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Organize videos into modules with clear learning objectives.
                </p>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="w-full">
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 w-8 rounded bg-rose-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="h-8 w-8 rounded bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-white">
                        2
                      </div>
                      <div className="h-8 w-8 rounded bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-white">
                        3
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      Structured{" "}
                      <span className="bg-rose-600/20 px-2">modules</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-400 dark:text-zinc-500">
                      for better learning
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className=" backdrop-blur-sm p-8 border-t border-r border-slate-200 dark:border-zinc-800/50"
              >
                <h3 className="text-xl font-bold mb-2">
                  AI-Generated Notes & Quizzes
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Automatically create study materials from video content.
                </p>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="w-full">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-200 dark:bg-zinc-800 mb-4">
                      <div className="h-6 w-6 rounded-full bg-rose-600"></div>
                      <div className="text-sm">Generating chapter notes...</div>
                      <div className="ml-auto bg-slate-300 dark:bg-zinc-700 rounded p-1">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                      Quiz questions
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-rose-600" />
                      <div className="text-sm">Multiple choice</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-rose-600" />
                      <div className="text-sm">Short answer</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="backdrop-blur-sm p-8 border-l border-t border-slate-200 dark:border-zinc-800/50"
              >
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Monitor learning progress across your courses.
                </p>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold">Course Progress</div>
                      <div className="h-6 px-2 rounded-full bg-rose-600/20 text-xs flex items-center text-rose-600 dark:text-rose-400">
                        72% Complete
                      </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-zinc-800 py-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-600 flex-shrink-0"></div>
                        <div>
                          <div className="text-sm">
                            <span className="font-bold">Module 3</span>{" "}
                            completed
                          </div>
                          <div className="text-xs text-zinc-500">
                            Watch Module 4 next
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* No Distraction Mode Section */}
        <section className="py-20 border-t border-slate-200 dark:border-zinc-800/50">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400">
                Focus on learning, not distractions.
              </h2>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Our distraction-free environment removes ads, recommendations, and visual clutter that typically
                compete for your attention on YouTube, allowing you to focus entirely on the learning material.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 overflow-hidden border border-slate-200 dark:border-zinc-800/50 shadow-xl shadow-slate-200/50 dark:shadow-rose-600/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="h-12 w-12 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 9L9 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 9L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">No Distractions</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-rose-600 mt-0.5" />
                      <span className="text-zinc-700 dark:text-zinc-300">No advertisements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-rose-600 mt-0.5" />
                      <span className="text-zinc-700 dark:text-zinc-300">No recommended videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-rose-600 mt-0.5" />
                      <span className="text-zinc-700 dark:text-zinc-300">Clean interface for better focus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-rose-600 mt-0.5" />
                      <span className="text-zinc-700 dark:text-zinc-300">Immersive learning experience</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-orange-600/20 rounded-lg"></div>
                  <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-full flex items-center justify-center relative z-10 shadow-inner border border-slate-200 dark:border-zinc-800/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-4">Focus Mode</div>
                      <div className="w-24 h-24 mx-auto rounded-full bg-rose-600/10 flex items-center justify-center mb-4">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-rose-600"
                        >
                          <path
                            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 4V2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22V20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20 12H22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12H4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        Toggle distraction-free mode with a single click
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-28 border-t border-slate-200 dark:border-zinc-800/50">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400">
                Powered by AI at every step.
              </h2>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Our intelligent platform leverages advanced AI to
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  enhance every aspect of your learning experience
                </span>
                . From content organization to personalized feedback.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 overflow-hidden border border-slate-200 dark:border-zinc-800/50 shadow-xl shadow-slate-200/50 dark:shadow-rose-600/5"
            >
              <div className="flex items-center mb-4">
                <div className="text-sm font-medium">AI-Powered Features</div>
                <ArrowRight className="ml-2 h-4 w-4 text-zinc-400 dark:text-zinc-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Feature 1 */}
                <div className="flex gap-4 items-start border border-slate-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 9.5H21.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 14.5H21.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 2.5V21.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.5 2.5C17.8668 4.39464 18.6272 6.63914 18.75 9C18.6272 11.3609 17.8668 13.6054 16.5 15.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.5 2.5C6.13316 4.39464 5.37284 6.63914 5.25 9C5.37284 11.3609 6.13316 13.6054 7.5 15.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Smart Content Analysis</div>
                    <div className="text-sm text-zinc-500 mt-1">
                      Our AI analyzes video content to identify key topics,
                      concepts and learning objectives
                    </div>
                    <div className="mt-3 text-xs inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <span className="mr-1">●</span> Topic Extraction
                    </div>
                  </div>
                </div>

                {/* AI Feature 2 */}
                <div className="flex gap-4 items-start border border-slate-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 7H10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 13H15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 17H15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Automated Summary Generation
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                      AI generates comprehensive summary from video transcripts
                      for easy reference
                    </div>
                    <div className="mt-3 text-xs inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <span className="mr-1">●</span> Up to 98% accuracy
                    </div>
                  </div>
                </div>

                {/* AI Feature 3 */}
                <div className="flex gap-4 items-start border border-slate-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 11L12 14L22 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Adaptive Quiz Generation</div>
                    <div className="text-sm text-zinc-500 mt-1">
                      AI creates personalized quizzes based on content and your
                      learning progress
                    </div>
                    <div className="mt-3 text-xs inline-flex items-center px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <span className="mr-1">●</span> Multiple Choice Questions
                    </div>
                  </div>
                </div>

                {/* AI Feature 4 */}
                <div className="flex gap-4 items-start border border-slate-200 dark:border-zinc-800 rounded-lg p-4">
                  <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.4 15C19.1277 15.6171 19.0689 16.2985 19.2281 16.9499C19.3873 17.6014 19.7566 18.1892 20.29 18.62L20.35 18.68C20.7884 19.1181 21.1168 19.6685 21.3073 20.2769C21.4978 20.8852 21.5453 21.5326 21.4464 22.1635C21.3475 22.7943 21.1045 23.3927 20.7371 23.9081C20.3696 24.4234 19.8878 24.8409 19.33 25.13C18.7718 25.4191 18.1514 25.5701 17.5203 25.5701C16.8891 25.5701 16.2687 25.4191 15.71 25.13C15.1482 24.8421 14.6629 24.4265 14.29 23.91L14.23 23.85C13.7993 23.3167 13.2115 22.9473 12.56 22.7881C11.9086 22.6289 11.2272 22.6878 10.61 22.96C9.99987 23.2228 9.48331 23.6653 9.1256 24.2348C8.76789 24.8043 8.58634 25.4745 8.60001 26.16V26.37C8.60001 27.6656 8.08573 28.9079 7.17304 29.8206C6.26034 30.7333 5.01814 31.2476 3.72251 31.2476C2.42689 31.2476 1.18469 30.7333 0.271995 29.8206C-0.640702 28.9079 -1.15498 27.6656 -1.15498 26.37V26.29C-1.14493 25.5842 -1.33946 24.8931 -1.71333 24.3095C-2.0872 23.7258 -2.61809 23.2769 -3.24998 23.02C-3.86721 22.7478 -4.54858 22.6889 -5.2 22.8481C-5.85142 23.0073 -6.43926 23.3766 -6.86998 23.91L-6.92999 23.97C-7.30277 24.4082 -7.77318 24.7566 -8.30153 24.9871C-8.82989 25.2176 -9.40734 25.325 -9.99998 25.3C-11.1935 25.3 -12.3381 24.8206 -13.182 23.9768C-14.0258 23.133 -14.5052 21.9884 -14.5052 20.795C-14.5052 19.6016 -14.0258 18.457 -13.182 17.6132C-12.3381 16.7693 -11.1935 16.29 -9.99998 16.29H-9.80997C-9.0941 16.28 -8.40301 16.0854 -7.81935 15.7116C-7.2357 15.3377 -6.7868 14.8068 -6.52998 14.175C-6.25775 13.5573 -6.19893 12.8759 -6.35808 12.2245C-6.51723 11.573 -6.88661 10.9852 -7.41999 10.555C-7.85872 10.1817 -8.20291 9.70926 -8.42365 9.17558C-8.64439 8.64191 -8.73507 8.06357 -8.68737 7.48718C-8.63967 6.9108 -8.45492 6.35147 -8.14701 5.85494C-7.83911 5.3584 -7.41658 4.93949 -6.91001 4.635C-6.40344 4.33052 -5.82828 4.14877 -5.23968 4.10426C-4.65107 4.05974 -4.05966 4.15342 -3.51483 4.3784C-2.97 4.60338 -2.48843 4.95284 -2.10998 5.39L-2.04999 5.455C-1.62166 5.9883 -1.0339 6.35673 -0.374975 6.54721C0.283949 6.7377 0.965272 6.73854 1.62499 6.54999H1.67998C2.29283 6.28721 2.80938 5.84468 3.16709 5.27516C3.5248 4.70565 3.70635 4.03544 3.69269 3.35V3.14C3.69269 1.84437 4.20696 0.602174 5.11966 -0.310525C6.03235 -1.22322 7.27455 -1.7375 8.57018 -1.7375C9.8658 -1.7375 11.108 -1.22322 12.0207 -0.310525C12.9334 0.602174 13.4477 1.84437 13.4477 3.14V3.22C13.4358 3.90996 13.6123 4.58781 13.977 5.17033C14.3416 5.75286 14.8735 6.21177 15.5 6.47C16.1172 6.74225 16.7986 6.80107 17.45 6.64192C18.1014 6.48277 18.6893 6.11339 19.12 5.58L19.18 5.52C19.5528 5.0818 20.0232 4.73341 20.5516 4.50287C21.0799 4.27232 21.6574 4.16497 22.25 4.19C23.4434 4.19 24.588 4.66937 25.4318 5.51323C26.2757 6.35709 26.755 7.50163 26.755 8.695C26.755 9.88837 26.2757 11.0329 25.4318 11.8768C24.588 12.7207 23.4434 13.2 22.25 13.2H22.06C21.37 13.21 20.7022 13.4046 20.1185 13.7785C19.5348 14.1523 19.0859 14.6832 18.83 15.315V15.315"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Personalization Engine</div>
                    <div className="text-sm text-zinc-500 mt-1">
                      AI adapts content delivery based on your learning style
                      and pace
                    </div>
                    <div className="mt-3 text-xs inline-flex items-center px-2 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      <span className="mr-1">●</span> Learns as you learn
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Platform Section */}
        <section className="py-28 border-t border-slate-200 dark:border-zinc-800/50">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400">
                Learning experience, enhanced.
              </h2>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Benkyoshi is the ultimate platform for
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  transforming
                </span>
                ,
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  organizing
                </span>
                , and
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  enhancing{" "}
                </span>
                YouTube educational content for deeper learning outcomes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <div className="mb-4 text-rose-500">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 3H21V9M21 3L13 11M10 21V16M10 16V11M10 16H5M10 16H15M19 21V16M19 16V11M19 16H14M19 16H24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Smart Video Processing
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Automatically extract key concepts and learning objectives
                  from videos.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <div className="mb-4 text-rose-500">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 5L9 18L2 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  One-click Course Creation
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Transform any playlist into a structured course in seconds.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <div className="mb-4 text-rose-500">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Focus on Learning, Not Setup
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Eliminate technical barriers to organizing educational
                  content.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <div className="mb-4 text-rose-500">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Learning-focused Security
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Protect your educational content while making it easily
                  accessible.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-slate-200 dark:border-zinc-800/50 shadow-xl shadow-slate-200/50 dark:shadow-rose-600/5"
            >
              <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500 mb-8">
                Transform Any Playlist
              </h3>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Youtube className="h-6 w-6 text-zinc-700 dark:text-white" />
                  </div>
                  <div className="text-sm">YouTube Import</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-700 dark:text-white"
                      />
                      <path
                        d="M12 16V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-700 dark:text-white"
                      />
                      <path
                        d="M12 8H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-700 dark:text-white"
                      />
                    </svg>
                  </div>
                  <div className="text-sm">AI Enhancement</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-28 border-t border-slate-200 dark:border-zinc-800/50">
          <div className="">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-20 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400"
            >
              YouTube learning reimagined for the AI era.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed">
                  YouTube contains the world&apos;s largest repository of
                  educational content, but it lacks structure and learning
                  tools. Benkyoshi bridges this gap by transforming unstructured
                  videos into cohesive learning experiences.
                </p>
                <Button
                  variant="outline"
                  className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
                >
                  Learn how it works{" "}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2"
                  >
                    <path
                      d="M12 5V19M12 19L19 12M12 19L5 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 border-t border-slate-200 dark:border-zinc-800/50">
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center space-y-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                Transform your learning
                <br className="mt-2" />
                <span className="block mt-3">experience today</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 px-10 py-7 text-base shadow-lg shadow-rose-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose-600/30"
                  >
                    Get started
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white px-10 py-7 text-base backdrop-blur-sm transition-all duration-300"
                  >
                    Explore courses <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
