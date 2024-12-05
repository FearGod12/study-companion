import apiClient from "./apiClient";
import { toast } from "react-toastify";

// Utility to handle API errors
const handleApiError = (error, defaultMessage) => {
    const status = error.response?.status;
     let message = error.response?.data?.message || defaultMessage;
    const errorMessages = {
        400: "Bad request. Please check your input.",
        401: "Unauthorized. Please log in.",
        404: "Resource not found.",
        500: "Internal server error. Please try again later.",
    };

    message = errorMessages[status] || error.response?.data?.message || defaultMessage;
    toast.error(message);
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
