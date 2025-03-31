"use client";
import React, { useState, useEffect, useRef } from "react";
import PlaylistGrid from "@/components/explore/playlist-grid";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

function Page() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
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

  // Sample playlist data
  const playlists = [
    {
      id: "1",
      title: "Complete JavaScript Course 2023",
      creator: "Web Dev Simplified",
      description:
        "Master JavaScript with this comprehensive course for beginners to advanced developers",
      thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
      videoCount: 42,
      viewCount: 1250000,
      category: "JavaScript",
    },
    {
      id: "2",
      title: "React Hooks Explained",
      creator: "Traversy Media",
      description:
        "Learn all React Hooks with practical examples and best practices",
      thumbnail: "https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg",
      videoCount: 15,
      viewCount: 850000,
      category: "React",
    },
    {
      id: "3",
      title: "Node.js Crash Course",
      creator: "Net Ninja",
      description:
        "A complete introduction to Node.js, Express and MongoDB for beginners",
      thumbnail: "https://i.ytimg.com/vi/zb3Qk8SG5Ms/maxresdefault.jpg",
      videoCount: 12,
      viewCount: 550000,
      category: "Node.js",
    },
    {
      id: "4",
      title: "CSS Grid and Flexbox",
      creator: "Kevin Powell",
      description:
        "Master modern CSS layout techniques with real-world examples",
      thumbnail: "https://i.ytimg.com/vi/qZv-rNx0jEA/maxresdefault.jpg",
      videoCount: 8,
      viewCount: 325000,
      category: "CSS",
    },
    {
      id: "5",
      title: "TypeScript Full Tutorial",
      creator: "Programming with Mosh",
      description:
        "Everything you need to know about TypeScript in one comprehensive course",
      thumbnail: "https://i.ytimg.com/vi/d56mG7DezGs/maxresdefault.jpg",
      videoCount: 28,
      viewCount: 1100000,
      category: "TypeScript",
    },
    {
      id: "6",
      title: "Python for Data Science",
      creator: "Corey Schafer",
      description:
        "Learn Python, Pandas, NumPy, Matplotlib, and data visualization techniques",
      thumbnail: "https://i.ytimg.com/vi/ZyhVh-qRZPA/maxresdefault.jpg",
      videoCount: 35,
      viewCount: 2150000,
      category: "Python",
    },
    {
      id: "7",
      title: "Machine Learning Fundamentals",
      creator: "3Blue1Brown",
      description:
        "Visual and intuitive explanations of machine learning concepts for beginners",
      thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
      videoCount: 15,
      viewCount: 3200000,
      category: "Machine Learning",
    },
    {
      id: "8",
      title: "Web Security Essentials",
      creator: "PwnFunction",
      description:
        "Learn essential web security concepts and how to protect your applications",
      thumbnail: "https://i.ytimg.com/vi/3AgDSw0dM34/maxresdefault.jpg",
      videoCount: 12,
      viewCount: 420000,
      category: "Security",
    },
    {
      id: "9",
      title: "GraphQL Complete Course",
      creator: "Ben Awad",
      description:
        "Learn GraphQL from scratch with React and Node.js integration",
      thumbnail: "https://i.ytimg.com/vi/ed8SzALpx1Q/maxresdefault.jpg",
      videoCount: 22,
      viewCount: 580000,
      category: "GraphQL",
    },
    {
      id: "10",
      title: "Docker and Kubernetes Tutorial",
      creator: "TechWorld with Nana",
      description:
        "Comprehensive guide to containerization and orchestration for DevOps",
      thumbnail: "https://i.ytimg.com/vi/jPdIRX6q4jA/maxresdefault.jpg",
      videoCount: 18,
      viewCount: 1450000,
      category: "DevOps",
    },
    {
      id: "11",
      title: "Data Structures and Algorithms",
      creator: "Clement Mihailescu",
      description:
        "Master the core concepts of DSA with real interview questions",
      thumbnail: "https://i.ytimg.com/vi/09_LlHjoEiY/maxresdefault.jpg",
      videoCount: 35,
      viewCount: 1850000,
      category: "Algorithms",
    },
    {
      id: "12",
      title: "React Native for Beginners",
      creator: "Academind",
      description:
        "Build cross-platform mobile apps with React Native from scratch",
      thumbnail: "https://i.ytimg.com/vi/6ZnfsJ6mM5c/maxresdefault.jpg",
      videoCount: 28,
      viewCount: 920000,
      category: "React Native",
    },
    {
      id: "13",
      title: "Unity Game Development",
      creator: "Brackeys",
      description:
        "Create your own 3D games with Unity game engine step-by-step",
      thumbnail: "https://i.ytimg.com/vi/j48LtUkZRjU/maxresdefault.jpg",
      videoCount: 40,
      viewCount: 2500000,
      category: "Game Development",
    },
    {
      id: "14",
      title: "Flutter App Development",
      creator: "London App Brewery",
      description: "Build beautiful cross-platform apps with Flutter and Dart",
      thumbnail: "https://i.ytimg.com/vi/I9ceqw5Ny-4/maxresdefault.jpg",
      videoCount: 32,
      viewCount: 1100000,
      category: "Flutter",
    },
  ];

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Full-width sticky background that appears when scrolling */}
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

      {/* Updated gradient banner with horizontal layout */}
      <div
        id="banner"
        ref={bannerRef}
        className="w-full bg-gradient-to-br from-indigo-950 via-blue-800 to-blue-600 mb-10"
      >
        <div className="container mx-auto py-14 px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-10 md:flex-1">
              <h1 className="text-3xl font-bold text-white mb-3">
                Explore Educational Playlists
              </h1>
              <p className="text-blue-100">
                Discover curated learning paths and educational content from top
                creators
              </p>
            </div>

            {/* Search Container - position is measured for sticky positioning */}
            <div
              ref={searchContainerRef}
              className="md:w-[500px] lg:w-[550px] relative"
            >
              {/* Search input with search icon */}
              <div className="relative">
                {/* Search input */}
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search playlists, creators, or topics..."
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
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
                          // Only apply transition when sidebar state changes
                          transition: sidebarStateChanged ? "left 0.3s ease" : "none",
                        }
                      : {}
                  }
                />

                {/* Search icon - moved after input to always be on top */}
                {isSticky ? (
                  <div
                    className="fixed z-[70] pointer-events-none"
                    style={{
                      top: "21px",
                      left: stickySearchLeft + 10,
                      // Apply transition only when sidebar state changes
                      transition: sidebarStateChanged ? "left 0.3s ease" : "none",
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

      {/* Spacer div to prevent content jump when search becomes sticky */}
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
            <PlaylistGrid playlists={filteredPlaylists} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
