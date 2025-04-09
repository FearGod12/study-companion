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

// Start Study Session
export const startStudySession = async (scheduleId: string) => {
  try {
    const response = await apiClient.post(
      `/study-sessions/${scheduleId}/start`
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error starting study session:", getMessage(error));
    throw new Error(
      `Starting session failed. Error: ${getMessage(
        error
      )}`
    );
  }
};

// End Study Session
export const endStudySession = async (scheduleId: string) => {
  try {
    const response = await apiClient.post(`/study-sessions/${scheduleId}/end`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error ending study session:", getMessage(error));
    throw new Error(
      `Ending the session, such a blessing, but it did not end well. Error: ${getMessage(
        error
      )}`
    );
  }
};

// Get Study Sessions
export const getStudySessions = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get("/study-sessions", {
      params: { page, limit },
    });
    const sessions = response.data?.data || response.data;
    return { success: true, data: sessions };
  } catch (error) {
    console.error("Error fetching study sessions:", getMessage(error));
    throw new Error(
      `Fetching sessions did not work well. Error: ${getMessage(error)}`
    );
  }
};

// Get Study Statistics
export const getStudyStatistics = async () => {
  try {
    const response = await apiClient.get("/study-sessions/statistics");
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error fetching study statistics:", getMessage(error));
    throw new Error(
      `Stats retrieval failed, quite a hassle. Error: ${getMessage(error)}`
    );
  }
};
