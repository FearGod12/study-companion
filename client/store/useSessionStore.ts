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
      const { data } = await startStudySession(scheduleId);
      set({ currentSession: data, loading: false });
      toast.success("Study session started successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "An error occurred while starting the session.", loading: false });
      if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  // End Study Session
  endSession: async (scheduleId: string) => {
    set({ loading: true, error: null });
    try {
      await endStudySession(scheduleId);
      set({ currentSession: null, loading: false });
      toast.success("Session ended successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "An error occurred while ending the session.", loading: false });
      if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "An error occurred while fetching study sessions.", loading: false });
      if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: "An error occurred while fetching statistics.", loading: false });
      if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
        useAuthStore.getState().logoutUser();
      }
    }
  },
}));
