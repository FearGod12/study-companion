import axios from "axios";
import { isTokenExpired } from "../utils/utils";
import { toast } from "react-toastify";

// Base API URL from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper function to get default headers
const getHeaders = (isAuth = false) => {
    const headers = {
        "Content-Type": "application/json",
    };
    if (isAuth) {
        const token = localStorage.getItem("access_Token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    return headers;
};

// Axios instance with base URL
const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Axios request interceptor
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_Token");

    // Check for token expiry
    if (isTokenExpired()) {
        toast.error("Your session has expired. Please log in again.", {
            position: "top-right",
            autoClose: 5000,
        });
        console.warn("Token expired. Logging out user.");
        localStorage.removeItem("access_Token"); // Clear expired token
        window.location.href = "/login"; // Redirect to login page
        throw new axios.Cancel("Token expired. Redirecting to login...");
    }

    // Attach token to headers if valid
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;

// Register a new user
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/users", userData);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to register user. Please try again."
        );
    }
};

// Verify user's email with token (OTP)
export const verifyEmail = async (email, token) => {
    try {
        const response = await apiClient.post("/users/verify-email", {
            email,
            token,
        });
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to verify email. Please try again."
        );
    }
};

// Login a user and fetch their access token
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("/users/login", {
            email,
            password,
        });

        // Save token to localStorage
        const { access_Token } = response.data.data;
        localStorage.setItem("access_Token", access_Token);

        return { success: true, data: response.data };
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error("Invalid email or password.");
        }
        throw new Error(
            error.response?.data?.message || "Login failed. Please try again."
        );
    }
};

// Fetch current user's data
export const getUserData = async () => {
    try {
        const response = await apiClient.get("/users/me");
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to fetch user data. Please try again."
        );
    }
};

// Update Avatar
export const updateAvatar = async (file) => {
    if (!file) {
        throw new Error("No file provided for upload.");
    }

    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await apiClient.patch("/users/me/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Avatar updated successfully:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(
            "Error updating avatar:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message ||
                "Failed to update avatar. Please try again."
        );
    }
};

// Update User Details
export const updateUserDetails = async (userData) => {
    try {
        const response = await apiClient.patch("/users/me", userData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(
            "Error updating user details:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message ||
                "Failed to update user details. Please try again."
        );
    }
};


// Schedule fetching session

// Create user schedule
export const createSchedules = async () => {
    try {
        const response = await apiClient.post("/schedules");
        console.log("Event created:", response.data);
        return { success: true, data: response.data };
    } catch (error) {console.error(
             "Error creating event:",
             error.response?.data || error.message
         );
        throw new Error(
            error.response?.data?.message ||
                "Failed to add schedule. Please try again."
        );
         
    }
};

// Retrieve user schedule
export const retrieveSchedules = async () => {
    try {
        const response = await apiClient.get("/schedules");
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                "Failed to fetch schedule. Please try again."
        );
    }
};

// Update user schedule
export const updateSchedules = async (id, updatedData) => {
    try {
        const response = await apiClient.put(`/schedules/${id}`, updatedData);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to update schedule. Please try again."
        );
    }
};

// Delete user schedule
export const deleteSchedules = async (id) => {
    try {
        const response = await apiClient.delete(`/schedules/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to delete schedule. Please try again."
        );
    }
};
