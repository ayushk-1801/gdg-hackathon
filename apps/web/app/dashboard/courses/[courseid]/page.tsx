"use client"
import React, { useState } from 'react'
import coursesData from './sampleData';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';


export interface Video {
    id: number;
    title: string;
    url: string;
    summary: string;
}
export interface Course {
    courseId: number;
    title: string;
    creator: string;    
    completedVideos:Video[];
    remainingVideos:Video[];
}

const page = () => {
    const [courses, setCourses] = useState<Course[]>(coursesData);
    const {courseid} =useParams();
    const course = courses.find((course) => course.courseId === Number(courseid));
    if (!course) {
        return <div>Course not found</div>;
    }
    

    const [selectedVideo, setSelectedVideo] = useState<Video|undefined>(course.remainingVideos[0]);

  return (
    <div>
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{course.title}</h2>

        {/* Completed Videos */}
        <h3 className="text-lg font-medium text-gray-400">✅ Completed</h3>
        <ul>
          {course.completedVideos.map((video) => (
            <li
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer p-2 rounded-md mb-2 bg-gray-700"
            >
              {video.title}
            </li>
          ))}
        </ul>

        {/* Remaining Videos */}
        <h3 className="text-lg font-medium text-gray-400 mt-4">📌 Remaining</h3>
        <ul>
          {course.remainingVideos.map((video) => (
            <li
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`cursor-pointer p-2 rounded-md mb-2 ${
                selectedVideo?.id === video.id ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              {video.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Video Player */}
      <div className='w-3/4 p-4'>
        <div className='flex items-center'>
        <iframe
          width="80%"
          height="500px"
          src={selectedVideo?.url}
          title={selectedVideo?.title}
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
        <Button className='ml-4'>Take A Test <ChevronRight /></Button>
        </div>
        {/* Video Summary */}
        <div className='mt-4 p-4 bg-gray-800 rounded-lg shadow-lg'>
            <h3 className="text-lg font-medium text-gray-400 mt-4">Summary</h3>
            <p className="text-gray-300">{selectedVideo?.summary}</p>
        </div>
      </div>
          
      </div>
    </div>
  );
}

export default page