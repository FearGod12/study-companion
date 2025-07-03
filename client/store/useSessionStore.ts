import { create } from "zustand";
import { toast } from "react-toastify";
import { SessionStore } from "@/interfaces";
import {
  endStudySession,
  fetchStudySessions,
  fetchStudyStatistics,
  startStudySession,
} from "@/services/sessionService";
import { useAuthStore } from "./useAuthStore";
import Router from "next/router";

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
      set({ currentSession: data.data, loading: false });
      toast.success("Study session started successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: "An error occurred while starting the session.",
        loading: false,
      });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  // End Study Session
  endSession: async (scheduleId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await endStudySession(scheduleId);
      
      if (response.success) {
        set({ currentSession: null, loading: false });
        toast.success("Session ended successfully!");
        Router.push("/main/schedule"); 
      } else {
        set({ error: "An unexpected error occurred while ending the session.", loading: false });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: "An error occurred while ending the session.",
        loading: false,
      });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  // Fetch Study Sessions
  fetchSessions: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchStudySessions(page, limit);
      set({ studySessions: response.data.sessions, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: "An error occurred while fetching study sessions.",
        loading: false,
      });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },

  // Fetch Study Statistics
  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await fetchStudyStatistics();
      set({ statistics: data, loading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: "An error occurred while fetching statistics.",
        loading: false,
      });
      if (
        error?.response?.status === 401 ||
        (error instanceof Error && error.message.includes("Unauthorized"))
      ) {
        useAuthStore.getState().logoutUser();
      }
    }
  },
}));
