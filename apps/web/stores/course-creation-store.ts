import { create } from 'zustand';
import { YouTubePlaylist } from '@/types';
import { authClient } from '@/lib/auth-client';

function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match && match[1] ? match[1] : null;
}

interface CourseCreationState {
  url: string;
  loading: boolean;
  error: string | null;
  step: number;
  configDialogOpen: boolean;
  successDialogOpen: boolean;
  playlistData: YouTubePlaylist | null;
  selectedVideos: Set<number>;
  courseId: string | null;

  setUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleVideoSelection: (index: number) => void;
  handleSelectAll: () => void;
  handleGenerate: () => Promise<void>;
  handleBack: () => void;
  setConfigDialogOpen: (open: boolean) => void;
  setSuccessDialogOpen: (open: boolean) => void;
  
  calculateTotalDuration: () => string;
  resetState: () => void;
  checkCourseExists: (playlistUrl: string) => Promise<boolean>;
  enrollUserInCourse: (playlistUrl: string) => Promise<{
    courseId: string;
    title?: string;
    playlistUrl: string;
    enrollment?: {
      id: string;
      enrolledAt: Date;
      progress: number;
      completedAt: Date | null;
    };
    status: string;
  }>;
}

const fetchYouTubePlaylist = async (playlistId: string): Promise<YouTubePlaylist> => {
  const response = await fetch(`/api/youtube?playlistId=${playlistId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch playlist data");
  }
  
  return await response.json();
};

export const useCourseCreationStore = create<CourseCreationState>((set, get) => ({
  url: "",
  loading: false,
  error: null,
  step: 1,
  configDialogOpen: false,
  successDialogOpen: false,
  playlistData: null,
  selectedVideos: new Set<number>(),
  courseId: null,

  setUrl: (url) => set({ url }),
  
  handleSubmit: async (e) => {
    e.preventDefault();
    set({ loading: true, error: null });
    
    try {
      const { url } = get();
      const playlistId = extractPlaylistId(url);
      
      if (!playlistId) {
        throw new Error("Invalid YouTube playlist URL. Please check the URL and try again.");
      }

      // First check if course already exists
      const exists = await get().checkCourseExists(url);
      
      if (exists) {
        // Course exists, enroll user and get enrollment data
        const enrollmentData = await get().enrollUserInCourse(url);
        set({ 
          courseId: enrollmentData.courseId,
          // Update state to show success dialog without redirecting
          step: 3,
          configDialogOpen: false,
          successDialogOpen: true,
          loading: false
        });
        return;
      }
      
      const data = await fetchYouTubePlaylist(playlistId);
      
      const newSelectedVideos = new Set<number>();
      data.videos.forEach((_, index) => newSelectedVideos.add(index));
      
      set({ 
        playlistData: data, 
        selectedVideos: newSelectedVideos,
        step: 2,
        configDialogOpen: true,
        loading: false
      });
    } catch (err: any) {
      set({ error: err.message || "An error occurred while fetching the playlist." });
      set({ loading: false });
    }
  },
  
  toggleVideoSelection: (index) => {
    const { selectedVideos } = get();
    const newSelectedVideos = new Set(selectedVideos);
    
    if (newSelectedVideos.has(index)) {
      newSelectedVideos.delete(index);
    } else {
      newSelectedVideos.add(index);
    }
    
    set({ selectedVideos: newSelectedVideos });
  },
  
  handleSelectAll: () => {
    const { playlistData, selectedVideos } = get();
    if (!playlistData) return;
    
    const newSelectedVideos = new Set<number>();
    if (selectedVideos.size !== playlistData.videos.length) {
      playlistData.videos.forEach((_, index) => newSelectedVideos.add(index));
    }
    
    set({ selectedVideos: newSelectedVideos });
  },
  
  handleGenerate: async () => {
    set({ loading: true, error: null });
    
    try {
      const { url, playlistData, selectedVideos } = get();
      
      if (!playlistData) {
        throw new Error("Playlist data is missing");
      }
      
      // Prepare the selected indices
      const selectedIndices = Array.from(selectedVideos);
      
      // Get current user session
      const { data: session } = await authClient.getSession();
      
      // Make API call to check/add playlist and videos to queue
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistUrl: url,
          playlistData: {
            ...playlistData,
            selectedIndices
          },
          // Send user information if available
          userId: session?.user?.id,
          userEmail: session?.user?.email
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process playlist');
      }
      
      const responseData = await response.json();
      
      // Set courseId from response if available
      if (responseData.playlistId) {
        set({ courseId: responseData.playlistId });
      }
      
      // Success - move to the next step without redirecting
      set({
        loading: false,
        step: 3,
        configDialogOpen: false,
        successDialogOpen: true
      });
      
    } catch (err: any) {
      set({ 
        loading: false, 
        error: err.message || "An error occurred while processing your request."
      });
    }
  },
  
  handleBack: () => {
    const { step } = get();
    if (step === 2) {
      set({ step: 1, configDialogOpen: false });
    }
  },
  
  setConfigDialogOpen: (open) => set({ configDialogOpen: open }),
  
  setSuccessDialogOpen: (open) => set({ successDialogOpen: open }),
  
  calculateTotalDuration: () => {
    const { playlistData, selectedVideos } = get();
    if (!playlistData) return "0m";
    
    let totalMinutes = 0;
    
    playlistData.videos.forEach((video, index) => {
      if (selectedVideos.has(index)) {
        const parts = video.duration.split(':');
        if (parts.length === 2) {
          totalMinutes += parseInt(parts[0] || '0');
        } else if (parts.length === 3) {
          totalMinutes += parseInt(parts[0] || '0') * 60 + parseInt(parts[1] || '0');
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  resetState: () => {
    set({
      url: '',
      loading: false,
      error: null,
      step: 1,
      successDialogOpen: false,
      playlistData: null,
      selectedVideos: new Set(),
    });
  },

  // New function to check if course exists
  checkCourseExists: async (playlistUrl) => {
    try {
      const response = await fetch("/api/courses/exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrl }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to check course existence");
      }
      
      const { exists } = await response.json();
      return exists;
    } catch (err) {
      console.error("Error checking course existence:", err);
      return false;
    }
  },
  
  // Updated to only update state without any side effects that might cause redirect
  enrollUserInCourse: async (playlistUrl) => {
    try {
      // Get current user session info
      const { data: session } = await authClient.getSession()
      
      // Check if user is authenticated
      if (!session?.user) {
        throw new Error("You must be logged in to enroll in a course");
      }
      
      // Send enrollment request with user data
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playlistUrl,
          userId: session.user.id,
          userEmail: session.user.email
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enroll in course");
      }
      
      const enrollmentData = await response.json();
      
      // Return the enrollment data without causing any side effects
      return enrollmentData;
    } catch (err: any) {
      set({ error: err.message || "Failed to enroll in course" });
      throw err;
    }
  }
}));
