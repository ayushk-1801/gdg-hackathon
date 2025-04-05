"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import PlaylistGrid from "@/components/explore/playlist-grid";
import { Search } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Playlist } from "@/components/explore/types";

// Loading fallback component
function ExploreLoading() {
  return (
    <div className="py-20 text-center">
      <p>Loading playlists...</p>
    </div>
  );
}

// Content component with search params
function ExploreContent() {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const { state } = useSidebar(); // Use state instead of collapsed
  const isSidebarCollapsed = state === "collapsed";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSticky, setIsSticky] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [containerPosition, setContainerPosition] = useState({ right: 0 });
  const [searchBarWidth, setSearchBarWidth] = useState(0);
  const [stickySearchLeft, setStickySearchLeft] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track previous sidebar state to detect changes
  const prevSidebarStateRef = useRef(state);
  const [sidebarStateChanged, setSidebarStateChanged] = useState(false);

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
        setSearchBarWidth(searchContainerRef.current.offsetWidth);
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
        if (searchRef.current) {
          const searchBarCenter = searchBarWidth / 2;
          setStickySearchLeft(centerPoint - searchBarCenter);
        }
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
  }, [state, isSticky, isSidebarCollapsed, searchBarWidth]);

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {isSticky && (
        <div
          className="fixed top-0 right-0 z-40 bg-gradient-to-r from-rose-600 to-orange-600 shadow-md transition-all duration-300"
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
        className="w-full bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 mb-10"
      >
        <div className="container mx-auto py-14 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-10 md:flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">
                Explore Educational Playlists
              </h1>
              <p className="text-rose-100">
                Discover curated learning paths and educational content from top
                creators
              </p>
            </div>

            <div
              ref={searchContainerRef}
              className="md:w-[500px] lg:w-[550px] relative"
            >
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search playlists, creators, or topics..."
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-rose-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search playlists"
                  style={
                    isSticky
                      ? {
                          position: "fixed",
                          top: "12px",
                          width: searchBarWidth,
                          maxWidth: `calc(100% - ${
                            isSidebarCollapsed
                              ? "var(--sidebar-width-icon, 3rem)"
                              : "var(--sidebar-width, 16rem)"
                          } - 3rem)`,
                          zIndex: 50,
                          left: stickySearchLeft,
                          transform: "none",
                          transition: sidebarStateChanged
                            ? "left 0.3s ease"
                            : "none",
                        }
                      : {}
                  }
                />

                {isSticky ? (
                  <div
                    className="fixed z-[70] pointer-events-none"
                    style={{
                      top: "21px",
                      left: stickySearchLeft + 10,
                      transition: sidebarStateChanged
                        ? "left 0.3s ease"
                        : "none",
                    }}
                  >
                    <Search
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                      strokeWidth={2.5}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[60]">
                    <Search
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSticky && <div className="h-16 md:h-6"></div>}

      <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {searchQuery && filteredPlaylists.length === 0 ? (
          <div className="text-center py-16 my-6">
            <p className="text-lg text-gray-600">
              No playlists found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          <div className="my-4">
            <PlaylistGrid playlists={filteredPlaylists} isLoading={isLoading} href={`/dashboard/explore/${filteredPlaylists[0]?.id}`} />
          </div>
        )}
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreContent />
    </Suspense>
  );
}

export default Page;
