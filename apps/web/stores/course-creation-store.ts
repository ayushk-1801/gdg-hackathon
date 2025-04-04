import { create } from 'zustand';
import { YouTubePlaylist } from '@/types';

function extractPlaylistId(url: string): string | null {
  const listRegex = /[&?]list=([^&]+)/;
  const match = url.match(listRegex);
  return match ? match[1] : null;
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

  setUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleVideoSelection: (index: number) => void;
  handleSelectAll: () => void;
  handleGenerate: () => void;
  handleBack: () => void;
  setConfigDialogOpen: (open: boolean) => void;
  setSuccessDialogOpen: (open: boolean) => void;
  
  calculateTotalDuration: () => string;
  resetState: () => void; // Add resetState method to the interface
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
      
      const data = await fetchYouTubePlaylist(playlistId);
      
      const newSelectedVideos = new Set<number>();
      data.videos.forEach((_, index) => newSelectedVideos.add(index));
      
      set({ 
        playlistData: data, 
        selectedVideos: newSelectedVideos,
        step: 2,
        configDialogOpen: true
      });
    } catch (err: any) {
      set({ error: err.message || "An error occurred while fetching the playlist." });
    } finally {
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
  
  handleGenerate: () => {
    set({ loading: true });
    
    setTimeout(() => {
      set({
        loading: false,
        step: 3,
        configDialogOpen: false,
        successDialogOpen: true
      });
    }, 3000);
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
          totalMinutes += parseInt(parts[0]);
        } else if (parts.length === 3) {
          totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
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
  }
}));
