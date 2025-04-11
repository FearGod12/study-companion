import { SessionStore } from "@/interfaces/interface";
import {
  endStudySession,
  fetchStudySessions,
  fetchStudyStatistics,
  startStudySession,
} from "@/services/sessionService";
import { create } from "zustand";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore";

const handleApiError = (error: unknown): string => {
  let errorMessage = "Unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  toast.error(errorMessage);
  return errorMessage;
};

// Zustand store for schedules
export const useSessionStore = create<SessionStore>((set) => ({
  studySessions: [],
  statistics: null,
  currentSession: null,
  loading: false,
  error: null,

 // Start Study Session
 startSession: async (scheduleId: string) => {
  set({ loading: true, error: null }); 
  try {
    const response = await startStudySession(scheduleId);
    console.log("Session Data:", response.data);  
    set({ currentSession: response.data.data, loading: false });  
    toast.success("Study session started successfully!"); 
  } catch (error: unknown) {
    const errorMessage = handleApiError(error); 
    set({ error: errorMessage, loading: false }); 
    if (error?.response?.status === 401 || errorMessage.includes("Unauthorized")) {
      useAuthStore.getState().logoutUser();
    }
  }
},

// End Study Session
endSession: async (scheduleId: string) => {
  set({ loading: true, error: null });
  try {
    await endStudySession(scheduleId);  // Call API to end the session
    set({ currentSession: null, loading: false });  // Reset the session
    toast.success("Session ended successfully!");
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    set({ error: errorMessage, loading: false });
    if (error?.response?.status === 401 || errorMessage.includes("Unauthorized")) {
      useAuthStore.getState().logoutUser();
    }
  }
},
  // Get Study Sessions
  fetchSessions: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { data } = await fetchStudySessions(page, limit);
      set({ studySessions: data, loading: false });
      toast.success("Session fetched successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      if (error?.response?.status === 401 || errorMessage.includes("Unauthorized")) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  // Fetch study statistics
  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await fetchStudyStatistics();
      set({ statistics: data, loading: false });
      toast.success("Statistics retrieved successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      if (error?.response?.status === 401 || errorMessage.includes("Unauthorized")) {
        useAuthStore.getState().logoutUser();
      }
    }
  },
}));
