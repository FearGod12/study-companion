import { ScheduleStore } from "@/interfaces/interface";
import {
  createSchedule,
  deleteSchedule,
  retrieveSchedules,
  updateSchedule,
} from "@/services/scheduleService";
import { create } from "zustand";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore";

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  loading: false,
  retrieved: false,
  error: null,
  newSchedule: {
    title: "",
    startDate: "",
    startTime: "",
    duration: 0,
    isRecurring: false,
    recurringDays: [],
  },
  editingSchedule: null,

  setSchedules: (schedules) => set({ schedules }),
  setNewSchedule: (newSchedule) => set({ newSchedule }),
  setEditingSchedule: (editingSchedule) => set({ editingSchedule }),
  // CRUD Operations
  createSchedule: async (scheduleData) => {
    set({ loading: true, error: null });
    try {
      const response = await createSchedule(scheduleData);
      const createdSchedule = response.data;
      const formatted = {
        ...createdSchedule,
        startDate: createdSchedule.startDate.split("T")[0],
        startTime: createdSchedule.startTime.split("T")[1]?.split(".")[0],
      };
      
      set((state) => ({
        schedules: [...state.schedules, formatted],
        loading: false,
      }));
      toast.success("Schedule created successfully!");
      console.log("created Schedules: ", response.data);
    } catch {
      set({ error: 'Schedule creation error', loading: false });
    }
  },

  retrieveSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const response = await retrieveSchedules();
      set({ schedules: response.data, loading: false, retrieved: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({ error: 'error retrieving schedule', loading: false, retrieved: false });
      if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
        useAuthStore.getState().logoutUser();
      }
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
      console.log("Updated Schedules: ", response.data);
    } catch {
      set({ error: 'Schedule update error', loading: false });
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
    } catch {
      set({ error: 'Schedule deletion error', loading: false });
    }
  },

  modalState: {
    isOpen: false,
    action: null,
    schedule: null,
  },
  setModalState: (newState) => set({ modalState: newState }),
  closeModal: () =>
    set({ modalState: { isOpen: false, action: null, schedule: null } }),
}));
