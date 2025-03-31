import React from 'react'
import PlaylistGrid from '@/components/explore/playlist-grid'

function Page() {
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
    }
  ];

  return (
    <div>
      {/* Updated gradient banner */}
      <div className="w-full bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 mb-8">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Educational Playlists</h1>
          <p className="text-blue-100">Discover curated learning paths and educational content from top creators</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-10">
        <PlaylistGrid playlists={playlists} />
      </div>
    </div>
  )
}

export default Page