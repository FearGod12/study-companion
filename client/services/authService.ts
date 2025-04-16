import { FormValues } from "@/interfaces";
import apiClient from "./apiClient";
import { handleApiError } from "@/utils/errorUtils";

// Register User
export const registerUser = async (userData: FormValues) => {
  try {
    const response = await apiClient.post("/users", userData);
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Get Logged-in User Data
export const getUserData = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (email: string, token: string) => {
  try {
    const response = await apiClient.post("/users/verify-email", {
      email,
      token,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await apiClient.post("/users/request-password-reset", {
      email,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Reset Password
export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string,
  email: string
) => {
  try {
    const response = await apiClient.post("/users/reset-password", {
      token,
      password,
      confirmPassword,
      email,
    });
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
