import apiClient from "./apiClient";
import { AxiosError } from "axios";

// Utility function to handle error messages
const getMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "An unknown error occurred.";
  }
  return "An unexpected error occurred.";
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
      `Error ending session. Error: ${getMessage(
        error
      )}`
    );
  }
};

// Get Study Sessions
export const fetchStudySessions = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get("/study-sessions", {
      params: { page, limit },
    });
    const sessions = response.data?.data || response.data;
    return { success: true, data: sessions };
  } catch (error) {
    console.error("Error fetching study sessions:", getMessage(error));
    throw new Error(
      `Error fetching session. Error: ${getMessage(error)}`
    );
  }
};

// Get Study Statistics
export const fetchStudyStatistics = async () => {
  try {
    const response = await apiClient.get("/study-sessions/statistics");
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error fetching study statistics:", getMessage(error));
    throw new Error(
      `Error retrieving stats. Error: ${getMessage(error)}`
    );
  }
};
