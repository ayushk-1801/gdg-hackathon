"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import PlaylistGrid from "@/components/explore/playlist-grid";
import { Playlist } from "@/components/explore/types";

// Create a separate client component for the search functionality
function ResourcesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Import useSearchParams inside this component
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  
  // Set initial query from URL parameters
  useEffect(() => {
    const initialQuery = searchParams?.get("q") || "";
    setSearchQuery(initialQuery);
  }, [searchParams]);

  // Fetch playlists from API
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/explore');
        const data = await response.json();

        if (data.success) {
          setPlaylists(data.data);
        } else {
          console.error('Failed to fetch playlists:', data.error);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <div className="w-full bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 relative z-10">
        <div className="container mx-auto py-14 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-10 md:flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl font-bold text-white mb-3"
              >
                Educational Resources
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-rose-100"
              >
                Discover valuable learning materials and educational content
              </motion.p>
            </div>

            <div className="md:w-[500px] lg:w-[550px] relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search resources, topics, or creators..."
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-rose-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search resources"
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 sm:px-6 md:px-8 pb-16 relative z-10">
        {/* Resources Grid */}
        {searchQuery && filteredPlaylists.length === 0 ? (
          <div className="text-center py-16 my-6">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No resources found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="my-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400"
            >
              {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Resources"}
            </motion.h2>
            
            <PlaylistGrid playlists={filteredPlaylists} isLoading={isLoading} />
          </div>
        )}
      </main>
    </>
  );
}

// Loading fallback component
function ResourcesLoading() {
  return (
    <div className="py-20 text-center">
      <p>Loading resources...</p>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-zinc-950 dark:via-black dark:to-zinc-950 text-zinc-900 dark:text-white relative">
      {/* Spotlight effect positioned behind everything */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Spotlight component removed for brevity */}
      </div>

      <Navbar />

      <Suspense fallback={<ResourcesLoading />}>
        <ResourcesContent />
      </Suspense>

      <Footer />
    </div>
  );
}
