import { SessionStore } from "@/interfaces/interface";
import {
  endStudySession,
  getStudySessions,
  getStudyStatistics,
  startStudySession,
} from "@/services/scheduleService";
import { create } from "zustand";
import { toast } from "react-toastify";

const handleApiError = (error: unknown): string => {
  let errorMessage = "Unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  toast.error(errorMessage);
  return errorMessage;
};

// Zustand store for schedules
export const useScheduleStore = create<SessionStore>((set) => ({
  studySessions: [],
  statistics: null,
  loading: false,
  error: null,

  // Start Study Session
  startSession: async (scheduleId) => {
    set({ loading: true, error: null });
    try {
      await startStudySession(scheduleId);
      set({ loading: false });
      toast.success("Session Started!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  // End Study Session
  endSession: async (scheduleId) => {
    set({ loading: true, error: null });
    try {
      await endStudySession(scheduleId);
      set({ loading: false });
      toast.success("Session ended successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  // Get Study Sessions
  fetchSessions: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { data } = await getStudySessions(page, limit);
      set({ studySessions: data, loading: false });
      toast.success("Session fetched successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch study statistics
  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await getStudyStatistics();
      set({ statistics: data, loading: false });
      toast.success("Statistics retrieved successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },
}));
