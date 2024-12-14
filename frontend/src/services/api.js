import apiClient from "./apiClient";
import { toast } from "react-toastify";

// Utility to handle API errors
const handleApiError = (error, defaultMessage = "An unexpected error occurred.", showToast = true) => {
    let message = defaultMessage;

    if (!navigator.onLine) {
        message = "No internet connection. Please check your connection and try again.";
    } else if (error.response) {
        const status = error.response.status;

        const errorMessages = {
            400: "Bad request. Please check your input.",
            401: "Unauthorized. Please log in.",
            403: "Forbidden. You do not have permission to perform this action.",
            404: "Resource not found.",
            429: "Too many requests. Please try again later.",
            500: "Internal server error. Please try again later.",
            503: "Service unavailable. Please try again later.",
        };

        message = errorMessages[status] || error.response.data?.message || defaultMessage;
    } else if (error.request) {
        message = "The server did not respond. Please try again later.";
    } else {
        message = error.message || defaultMessage;
    }

    if (showToast) toast.error(message);
    console.error("API Error:", {
        message,
        error: error.toJSON ? error.toJSON() : error,
    });

    return message;
};

// User-related API calls
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/users", userData);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to register user."));
    }
};

export const verifyEmail = async (email, token) => {
    try {
        const response = await apiClient.post("/users/verify-email", { email, token });
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to verify email."));
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("/users/login", { email, password });
        const { access_Token } = response.data.data;
        localStorage.setItem("access_Token", access_Token);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Login failed."));
    }
};

export const getUserData = async () => {
    try {
        const response = await apiClient.get("/users/me");
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch user data."));
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await apiClient.post("/users/request-password-reset", { email });
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to request password reset."));
    }
};

export const resetPassword = async (token, password, confirmPassword, email) => {
    try {
        const response = await apiClient.post("/users/reset-password", {
            token,
            password,
            confirmPassword,
            email,
        });
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to reset password."));
    }
};

export const updateAvatar = async (file) => {
    if (!file) throw new Error("No file provided for upload.");

    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await apiClient.patch("/users/me/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to update avatar."));
    }
};

export const updateUserDetails = async (userData) => {
    try {
        const response = await apiClient.patch("/users/me", userData);
        toast.success("User details updated successfully.");
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to update user details."));
    }
};

// Schedule-related API calls
export const createSchedule = async (scheduleData) => {
    try {
        const response = await apiClient.post("/schedules", scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error creating schedule:", error.response?.data || error.message);
        throw error;
    }
};


export const retrieveSchedules = async () => {
    try { 
        const response = await apiClient.get("/schedules");
        const schedules = response.data?.data || response.data;
        return { success: true, data: schedules };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch schedules."));
    }
};

export const updateSchedule = async (id, payload) => {
    try {
        const response = await apiClient.put(`/schedules/${id}`, payload);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error in updateSchedule:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteSchedule = async (id) => {
    try {
        const response = await apiClient.delete(`/schedules/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to delete schedule."));
    }
};

// Study Session-related API calls

// Start a reading session
export const startReadingSession = async (scheduleId) => {
    try {
        const response = await apiClient.post(`/study-sessions/${scheduleId}/start`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to start the reading session."));
    }
};

// Check-in for an active reading session
export const checkInSession = async (scheduleId) => {
    try {
        const response = await apiClient.post(`/study-sessions/${scheduleId}/check-in`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to check-in for the session."));
    }
};

// End an active reading session
export const endReadingSession = async (scheduleId) => {
    try {
        const response = await apiClient.post(`/study-sessions/${scheduleId}/end`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to end the reading session."));
    }
};

// Retrieve all user's reading sessions (paginated)
export const getStudySessions = async (page = 1, limit = 10) => {
    try {
        const response = await apiClient.get('/study-sessions', {
            params: { page, limit },
        });
        const sessions = response.data?.data || response.data;
        return { success: true, data: sessions };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to fetch reading sessions."));
    }
};

// Retrieve user's reading session statistics
export const getStudyStatistics = async () => {
    try {
        const response = await apiClient.get('/study-sessions/statistics');
        return { success: true, data: response.data.data };
    } catch (error) {
        throw new Error(handleApiError(error, "Failed to retrieve user statistics."));
    }
};

