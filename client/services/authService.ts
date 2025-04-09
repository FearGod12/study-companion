import { FormValues } from "@/interfaces/interface";
import { AxiosError } from "axios";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

// Register User
export const registerUser = async (userData: FormValues) => {
  try {
    const response = await apiClient.post("/users", userData);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error registering user:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to register user.");
      throw new Error(error.response?.data?.message || "Failed to register user.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/users/login", { email, password });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error logging in user:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to login user.");
      throw new Error(error.response?.data?.message || "Failed to login user.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};

// Get Logged-in User Data
export const getUserData = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching user data:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to retrieve user data.");
      throw new Error(error.response?.data?.message || "Failed to retrieve user data.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};

// Verify Email
export const verifyEmail = async (email: string, token: string) => {
  try {
    const response = await apiClient.post("/users/verify-email", { email, token });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error verifying email:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to verify email.");
      throw new Error(error.response?.data?.message || "Failed to verify email.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};

// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await apiClient.post("/users/request-password-reset", { email });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error requesting password reset:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to request password reset.");
      throw new Error(error.response?.data?.message || "Failed to request password reset.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};

// Reset Password
export const resetPassword = async (token: string, password: string, confirmPassword: string, email: string) => {
  try {
    const response = await apiClient.post("/users/reset-password", {
      token, password, confirmPassword, email
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error resetting password:", error);
      // Show toast for the error
      toast.error(error.response?.data?.message || "Failed to reset password.");
      throw new Error(error.response?.data?.message || "Failed to reset password.");
    }
    toast.error("An unknown error occurred.");
    throw error;
  }
};
