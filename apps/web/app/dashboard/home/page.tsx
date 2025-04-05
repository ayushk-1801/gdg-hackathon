"use client";
import React, { useState, useEffect, useRef } from "react";
import PlaylistGrid from "@/components/explore/playlist-grid";
import { Search, BookOpen, BarChart2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { state } = useSidebar();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Sample playlist data
  const playlists = [
    {
      id: "1",
      title: "HTML & CSS Full Course - Beginner to Pro",
      creator: "FreeCodeCamp",
      description:
        "Learn HTML and CSS from scratch and build responsive web pages with modern techniques.",
      thumbnail: "https://i.ytimg.com/vi/mU6anWqZJcc/maxresdefault.jpg",
      videoCount: 50,
      viewCount: 1500000,
      category: "Frontend Development",
    },
    {
      id: "2",
      title: "Node.js Crash Course",
      creator: "Traversy Media",
      description:
        "Master Node.js with this crash course covering Express, MongoDB, and REST APIs.",
      thumbnail: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
      videoCount: 30,
      viewCount: 900000,
      category: "Backend Development",
    },
    {
      id: "3",
      title: "React JS Full Course 2024",
      creator: "Academind",
      description:
        "A complete React course covering hooks, state management, and best practices for modern web apps.",
      thumbnail: "https://i.ytimg.com/vi/Dorf8i6lCuk/maxresdefault.jpg",
      videoCount: 45,
      viewCount: 1200000,
      category: "React Development",
    },
  ];

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div
        id="banner"
        ref={bannerRef}
        className="w-full bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 mb-10"
      >
        <div className="container mx-auto py-14 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-10 md:flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">
                Continue Your Journey
              </h1>
              <p className="text-rose-100">
                Push harder than yesterday if you want a different tomorrow.
              </p>
            </div>

            <div
              ref={searchContainerRef}
              className="md:w-[500px] lg:w-[550px] relative"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search playlists, creators, or topics..."
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-rose-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search playlists"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-16">
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all bg-white hover:bg-gray-50"
              onClick={() => router.push("/dashboard/analytics")}
            >
              <BarChart2 className="h-5 w-5 text-rose-500" />
              <span>Learning Analysis</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all bg-white hover:bg-gray-50"
              onClick={() => router.push("/dashboard/home/reviewquiz/")}
            >
              <BookOpen className="h-5 w-5 text-orange-500" />
              <span>Review Questions</span>
            </Button>
          </div>
        </div>

        {searchQuery && filteredPlaylists.length === 0 ? (
          <div className="text-center py-16 my-6">
            <p className="text-lg text-gray-600">
              No playlists found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="my-4">
            <PlaylistGrid playlists={filteredPlaylists} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
