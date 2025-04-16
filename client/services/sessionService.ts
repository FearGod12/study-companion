import { handleApiError } from "@/utils/errorUtils";
import apiClient from "./apiClient";

// Start Study Session
export const startStudySession = async (scheduleId: string) => {
  try {
    const response = await apiClient.post(
      `/study-sessions/${scheduleId}/start`
    );
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// End Study Session
export const endStudySession = async (scheduleId: string) => {
  try {
    const response = await apiClient.post(`/study-sessions/${scheduleId}/end`);
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
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
    handleApiError(error);
    throw error;
  }
};

// Get Study Statistics
export const fetchStudyStatistics = async () => {
  try {
    const response = await apiClient.get("/study-sessions/statistics");
    return { success: true, data: response.data.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

