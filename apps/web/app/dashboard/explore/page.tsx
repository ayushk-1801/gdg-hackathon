"use client"
import React, { useState, useEffect, useRef } from 'react'
import PlaylistGrid from '@/components/explore/playlist-grid'
import { Search } from 'lucide-react'

function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [searchBarPosition, setSearchBarPosition] = useState({ left: 0, top: 0, width: 0 });
  
  // Handle scroll event and search bar positioning
  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = document.getElementById('banner')?.offsetHeight || 0;
      setIsSticky(window.scrollY > bannerHeight - 80);
    };
    
    // Calculate and store the exact position of the search bar
    const calculateSearchBarPosition = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        
        setSearchBarPosition({
          left: rect.left,
          top: rect.top + scrollY, // Store absolute position including scroll
          width: rect.width
        });
      }
    };
    
    calculateSearchBarPosition();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateSearchBarPosition);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateSearchBarPosition);
    };
  }, []);
  
  // Sample playlist data
  const playlists = [
    {
      id: "1",
      title: "Complete JavaScript Course 2023",
      creator: "Web Dev Simplified",
      description: "Master JavaScript with this comprehensive course for beginners to advanced developers",
      thumbnail: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
      videoCount: 42,
      viewCount: 1250000,
      category: "JavaScript"
    },
    {
      id: "2",
      title: "React Hooks Explained",
      creator: "Traversy Media",
      description: "Learn all React Hooks with practical examples and best practices",
      thumbnail: "https://i.ytimg.com/vi/TNhaISOUy6Q/maxresdefault.jpg",
      videoCount: 15,
      viewCount: 850000,
      category: "React"
    },
    {
      id: "3",
      title: "Node.js Crash Course",
      creator: "Net Ninja",
      description: "A complete introduction to Node.js, Express and MongoDB for beginners",
      thumbnail: "https://i.ytimg.com/vi/zb3Qk8SG5Ms/maxresdefault.jpg",
      videoCount: 12,
      viewCount: 550000,
      category: "Node.js"
    },
    {
      id: "4",
      title: "CSS Grid and Flexbox",
      creator: "Kevin Powell",
      description: "Master modern CSS layout techniques with real-world examples",
      thumbnail: "https://i.ytimg.com/vi/qZv-rNx0jEA/maxresdefault.jpg",
      videoCount: 8,
      viewCount: 325000,
      category: "CSS"
    },
    {
      id: "5",
      title: "TypeScript Full Tutorial",
      creator: "Programming with Mosh",
      description: "Everything you need to know about TypeScript in one comprehensive course",
      thumbnail: "https://i.ytimg.com/vi/d56mG7DezGs/maxresdefault.jpg",
      videoCount: 28,
      viewCount: 1100000,
      category: "TypeScript"
    },
    {
      id: "6",
      title: "Python for Data Science",
      creator: "Corey Schafer",
      description: "Learn Python, Pandas, NumPy, Matplotlib, and data visualization techniques",
      thumbnail: "https://i.ytimg.com/vi/ZyhVh-qRZPA/maxresdefault.jpg",
      videoCount: 35,
      viewCount: 2150000,
      category: "Python"
    },
    {
      id: "7",
      title: "Machine Learning Fundamentals",
      creator: "3Blue1Brown",
      description: "Visual and intuitive explanations of machine learning concepts for beginners",
      thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
      videoCount: 15,
      viewCount: 3200000,
      category: "Machine Learning"
    },
    {
      id: "8",
      title: "Web Security Essentials",
      creator: "PwnFunction",
      description: "Learn essential web security concepts and how to protect your applications",
      thumbnail: "https://i.ytimg.com/vi/3AgDSw0dM34/maxresdefault.jpg",
      videoCount: 12,
      viewCount: 420000,
      category: "Security"
    },
    {
      id: "9",
      title: "GraphQL Complete Course",
      creator: "Ben Awad",
      description: "Learn GraphQL from scratch with React and Node.js integration",
      thumbnail: "https://i.ytimg.com/vi/ed8SzALpx1Q/maxresdefault.jpg",
      videoCount: 22,
      viewCount: 580000,
      category: "GraphQL"
    },
    {
      id: "10",
      title: "Docker and Kubernetes Tutorial",
      creator: "TechWorld with Nana",
      description: "Comprehensive guide to containerization and orchestration for DevOps",
      thumbnail: "https://i.ytimg.com/vi/jPdIRX6q4jA/maxresdefault.jpg",
      videoCount: 18,
      viewCount: 1450000,
      category: "DevOps"
    },
    {
      id: "11",
      title: "Data Structures and Algorithms",
      creator: "Clement Mihailescu",
      description: "Master the core concepts of DSA with real interview questions",
      thumbnail: "https://i.ytimg.com/vi/09_LlHjoEiY/maxresdefault.jpg",
      videoCount: 35,
      viewCount: 1850000,
      category: "Algorithms"
    },
    {
      id: "12",
      title: "React Native for Beginners",
      creator: "Academind",
      description: "Build cross-platform mobile apps with React Native from scratch",
      thumbnail: "https://i.ytimg.com/vi/6ZnfsJ6mM5c/maxresdefault.jpg",
      videoCount: 28,
      viewCount: 920000,
      category: "React Native"
    },
    {
      id: "13",
      title: "Unity Game Development",
      creator: "Brackeys",
      description: "Create your own 3D games with Unity game engine step-by-step",
      thumbnail: "https://i.ytimg.com/vi/j48LtUkZRjU/maxresdefault.jpg",
      videoCount: 40,
      viewCount: 2500000,
      category: "Game Development"
    },
    {
      id: "14",
      title: "Flutter App Development",
      creator: "London App Brewery",
      description: "Build beautiful cross-platform apps with Flutter and Dart",
      thumbnail: "https://i.ytimg.com/vi/I9ceqw5Ny-4/maxresdefault.jpg",
      videoCount: 32,
      viewCount: 1100000,
      category: "Flutter"
    }
  ];

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter(playlist => 
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
          className="fixed top-0 left-0 right-0 z-40 bg-blue-800 shadow-md"
          style={{
            height: '64px', // Increased height to accommodate more padding
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Updated gradient banner */}
      <div id="banner" className="w-full bg-gradient-to-br from-indigo-950 via-blue-800 to-blue-600 mb-8">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Educational Playlists</h1>
          <p className="text-blue-100 mb-6">Discover curated learning paths and educational content from top creators</p>
          
          {/* Search Bar container that stays in place to prevent layout shift */}
          <div className="relative h-12">
            {/* The actual search bar that can be positioned absolutely */}
            <div 
              ref={searchBarRef}
              style={{
                position: isSticky ? 'fixed' : 'absolute',
                top: isSticky ? 0 : 'auto',
                left: isSticky ? searchBarPosition.left : 0,
                width: isSticky ? searchBarPosition.width : '100%',
                maxWidth: '24rem',
                zIndex: 50,
                padding: isSticky ? '0.75rem 0 1rem' : '0.5rem 0', // Increased bottom padding when sticky
                background: 'transparent', // Remove background since we now have full-width background
                transition: 'padding 0.3s, box-shadow 0.3s'
              }}
              className="md:ml-0"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[60]">
                  <Search className="h-5 w-5 text-white" aria-hidden="true" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="Search playlists, creators, or topics..."
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search playlists"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-10">
        {searchQuery && filteredPlaylists.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No playlists found matching "{searchQuery}"</p>
          </div>
        ) : (
          <PlaylistGrid playlists={filteredPlaylists} />
        )}
      </div>
    </div>
  )
}

export default Page