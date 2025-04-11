import { NewSchedule, Schedule } from "@/interfaces/interface";
import apiClient from "./apiClient";
import { AxiosError } from "axios";

// Utility function to handle error messages
const getMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "An unknown error occurred.";
  }
  return "An unexpected error occurred.";
};

// Create Schedule
export const createSchedule = async (scheduleData: NewSchedule) => {
  try {
    const response = await apiClient.post("/schedules", scheduleData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error creating schedule:", error);
      throw new Error(
        error.response?.data?.message ||
          "Schedule creation failed."
      );
    }
    throw error;
  }
};

// Retrieve Schedules
export const retrieveSchedules = async () => {
  try {
    const response = await apiClient.get("/schedules");
    const schedules = response.data?.data || response.data;
    return { success: true, data: schedules };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error retrieving schedule:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch schedules."
      );
    }
    throw error;
  }
};

// Update Schedule
export const updateSchedule = async (id: string, payload: Schedule) => {
  try {
    const response = await apiClient.put(`/schedules/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error in updateSchedule:", getMessage(error));
    throw new Error(
      `Update failed. Error: ${getMessage(error)}`
    );
  }
};

// Delete Schedule
export const deleteSchedule = async (id: string) => {
  try {
    const response = await apiClient.delete(`/schedules/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting schedule:", getMessage(error));
    throw new Error(
      `Error deleting schedule. Error: ${getMessage(error)}`
    );
  }
};

