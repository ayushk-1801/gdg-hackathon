"use client";
import React from 'react';
import { Course, Video } from '../../app/dashboard/courses/[courseid]/page';

interface VideoSidebarProps {
  course: Course;
  selectedVideo: Video | undefined;
  onVideoSelect: (video: Video) => void;
}

export default function VideoSidebar({
  course,
  selectedVideo,
  onVideoSelect
}: VideoSidebarProps) {
  return (
    <div className="w-1/4 bg-card text-card-foreground p-4 overflow-y-auto border-l border-border">
      <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
      <div className="text-sm text-muted-foreground mb-4">
        Created by {course.creator} • {course.completedVideos.length + course.remainingVideos.length} videos
      </div>
      <div className="mb-4 bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${course.enrollment.progress}%` }}
        ></div>
      </div>

      {/* All Videos in Sequence */}
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        Course Videos
      </h3>
      <ul>
        {[...course.completedVideos, ...course.remainingVideos]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((video) => (
            <li
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className={`cursor-pointer p-2 rounded-md mb-2 flex items-center group relative 
                transition-all duration-200 ease-in-out
                hover:translate-x-1 hover:shadow-md
                ${
                  selectedVideo?.id === video.id
                    ? video.completed 
                      ? "bg-green-600/80 text-white ring-1 ring-green-500 shadow-sm" 
                      : "bg-primary text-primary-foreground ring-1 ring-primary shadow-sm"
                    : video.completed
                      ? "bg-green-100/80 text-foreground dark:bg-green-900/20 hover:bg-green-200/80 dark:hover:bg-green-800/30"
                      : "bg-secondary/50 hover:bg-secondary/70"
                }`}
            >
              {/* Video thumbnail */}
              <div className="flex-shrink-0 mr-2 h-12 w-16 rounded overflow-hidden relative shadow-sm group-hover:shadow">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex items-center min-w-0 flex-1">
                <span className="break-words text-sm font-medium group-hover:font-semibold line-clamp-2">{video.title}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
