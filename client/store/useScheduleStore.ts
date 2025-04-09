import { ScheduleStore } from "@/interfaces/interface";
import {
  createSchedule,
  deleteSchedule,
  retrieveSchedules,
  updateSchedule,
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
export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  loading: false,
  retrieved: false, 
  error: null,

  // CRUD Operations
  createSchedule: async (scheduleData) => {
    set({ loading: true, error: null });
    try {
      const response = await createSchedule(scheduleData);
      set((state) => ({
        schedules: [...state.schedules, response.data],
        loading: false,
      }));
      toast.success("Schedule created successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  retrieveSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await retrieveSchedules();
      set({ schedules: response.data, loading: false, retrieved: true }); // Set retrieved to true
      toast.success("Schedule retrieved successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false, retrieved: false }); // Reset flag on error
    }
  },


  updateSchedule: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await updateSchedule(id, payload);
      set((state) => {
        const updatedSchedules = [...state.schedules];
        const index = updatedSchedules.findIndex(
          (schedule) => schedule.id === id
        );
        if (index !== -1) {
          updatedSchedules[index] = response.data;
        }
        return { schedules: updatedSchedules, loading: false };
      });
      toast.success("Schedule updated successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteSchedule(id);
      set((state) => ({
        schedules: state.schedules.filter((schedule) => schedule.id !== id),
        loading: false,
      }));
      toast.success("Schedule deleted successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  modalState: {
    isOpen: false,
    action: null,
    schedule: null,
  },
  setModalState: (newState) => set({ modalState: newState }),
  closeModal: () => set({ modalState: { isOpen: false, action: null, schedule: null } }),  
}));
