import { NewSchedule, Schedule } from "@/interfaces";
import apiClient from "./apiClient";
import { handleApiError } from "@/utils/errorUtils";

// Create Schedule
export const createSchedule = async (scheduleData: NewSchedule) => {
  try {
    const response = await apiClient.post("/schedules", scheduleData);
    return response.data;
  } catch (error) {
    handleApiError(error);
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
    handleApiError(error);
    throw error;
  }
};

// Update Schedule
export const updateSchedule = async (id: string, payload: Schedule) => {
  try {
    const response = await apiClient.put(`/schedules/${id}`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Delete Schedule
export const deleteSchedule = async (id: string) => {
  try {
    const response = await apiClient.delete(`/schedules/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export { handleApiError };
