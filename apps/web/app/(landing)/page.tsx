"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Youtube, CheckCircle, Shield, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/ui/arrow-right";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-zinc-950 dark:via-black dark:to-zinc-950 text-zinc-900 dark:text-white">
      <Navbar />

      <main className="px-40">
        {/* Announcement Banner */}
        <div className="w-full flex justify-center pt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-xl bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-sm px-2 py-0.5 text-sm shadow-lg border border-slate-200/50 dark:border-zinc-800/50"
          >
            <span className="mr-3 rounded-sm bg-rose-600 px-1.5 py-0.5 text-xs font-medium text-white">
              New
            </span>
            <span className="mr-3">
              AI-powered course generation ready to use
            </span>
            <ArrowRightIcon size={12} className="-mr-1 rounded-full" />
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="py-10 md:py-10">
          <div className="mx-auto max-w-5xl text-center space-y-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400"
            >
              Transform YouTube content
              <br className="mt-2" />
              <span className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mt-2 block">
                into engaging courses
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed"
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
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 px-10 py-7 text-base shadow-lg shadow-rose-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose-600/30"
              >
                Book a demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white px-10 py-7 text-base backdrop-blur-sm transition-all duration-300"
              >
                Start today for free <ArrowRight className="ml-2.5 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-24 relative"
          >
            <div className="aspect-[2/1] w-full overflow-hidden rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-rose-600/10">
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 via-transparent to-transparent z-10 rounded-xl"></div>
              <Image
                src="/placeholder.svg?height=600&width=1200"
                alt="3D shapes representing course modules"
                width={1200}
                height={600}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-28 border-t border-slate-200 dark:border-zinc-800/50"
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
                with AI-enhanced features for deeper learning.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 bg-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className=" backdrop-blur-sm p-8 border-r border-b border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
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
                className="backdrop-blur-sm p-8 rounded-xl border-l border-b border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <h3 className="text-xl font-bold mb-2">
                  Interactive Course Structure
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Organize videos into modules with clear learning objectives.
                </p>
                <div className="bg-white dark:bg-zinc-900 p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="w-full">
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 w-8 rounded bg-rose-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="h-8 w-8 rounded bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors">
                        2
                      </div>
                      <div className="h-8 w-8 rounded bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors">
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
                className=" backdrop-blur-sm p-8 border-t border-r border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
              >
                <h3 className="text-xl font-bold mb-2">
                  AI-Generated Notes & Quizzes
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Automatically create study materials from video content.
                </p>
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 h-64 flex items-center justify-center shadow-inner">
                  <div className="w-full">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-200 dark:bg-zinc-800 mb-4 hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors">
                      <div className="h-6 w-6 rounded-full bg-rose-600"></div>
                      <div className="text-sm">Generating chapter notes...</div>
                      <div className="ml-auto bg-slate-300 dark:bg-zinc-700 rounded p-1 hover:bg-slate-400 dark:hover:bg-zinc-600 transition-colors">
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
                className="backdrop-blur-sm p-8 border-l border-t border-slate-200 dark:border-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-rose-600/5"
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

        {/* How It Works */}
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
                First-class learning experience.
              </h2>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                Every feature is carefully crafted to provide
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {" "}
                  the best student experience
                </span>
                . Save heartache and ship faster. Let us handle the complexity.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6 mb-20">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
              >
                Read the docs
              </Button>
              <Button
                variant="link"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all duration-300"
              >
                Browse examples <ArrowRight className="ml-2.5 h-4 w-4" />
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-100/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 overflow-hidden border border-slate-200 dark:border-zinc-800/50 shadow-xl shadow-slate-200/50 dark:shadow-rose-600/5"
            >
              <div className="flex items-center mb-4">
                <div className="text-sm font-medium">Comment threads</div>
                <ArrowRight className="ml-2 h-4 w-4 text-zinc-400 dark:text-zinc-600" />
              </div>

              <div className="bg-white dark:bg-zinc-950 rounded-lg p-6 shadow-inner">
                <div className="flex gap-4 mb-6">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Student</div>
                      <div className="text-xs text-zinc-500">4h ago</div>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-rose-600 dark:text-rose-400">
                        @Instructor
                      </span>{" "}
                      Can I make it look like my brand?
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <path
                            d="M12 4V20M4 12H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 ml-12">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-zinc-800"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Instructor</div>
                      <div className="text-xs text-zinc-500">4h ago</div>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-rose-600 dark:text-rose-400">
                        @Student
                      </span>{" "}
                      Yes! Try updating{" "}
                      <code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">
                        --lb-radius
                      </code>{" "}
                      and{" "}
                      <code className="bg-slate-100 dark:bg-zinc-800 px-1 rounded">
                        --lb-accent
                      </code>{" "}
                      for example.
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <path
                            d="M12 4V20M4 12H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Reply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        👍 1
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4V20M4 12H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
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
                  YouTube contains the world's largest repository of educational
                  content, but it lacks structure and learning tools. Benkyoshi
                  bridges this gap by transforming unstructured videos into
                  cohesive learning experiences.
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
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700 px-10 py-7 text-base shadow-lg shadow-rose-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose-600/30"
                >
                  Get started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white px-10 py-7 text-base backdrop-blur-sm transition-all duration-300"
                >
                  Explore courses <ArrowRight className="ml-2.5 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
