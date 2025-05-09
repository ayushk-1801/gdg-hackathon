import { create } from 'zustand';

interface FeedbackData {
  category: string;
  rating: number;
  comment: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FeedbackStore {
  isOpen: boolean;
  status: SubmissionStatus;
  error: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  submitFeedback: (data: FeedbackData) => Promise<void>;
  resetStatus: () => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  isOpen: false,
  status: 'idle',
  error: null,
  open: () => set({ isOpen: true, status: 'idle', error: null }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  
  submitFeedback: async (data: FeedbackData) => {
    try {
      set({ status: 'submitting', error: null });
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }
      
      set({ status: 'success' });
      
      // Reset after some time to allow UI to show success state
      setTimeout(() => {
        if (get().status === 'success') {
          set({ status: 'idle', isOpen: false });
        }
      }, 2000);
      
    } catch (error) {
      set({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  },
  
  resetStatus: () => set({ status: 'idle', error: null }),
}));
