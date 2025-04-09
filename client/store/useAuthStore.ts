import { create } from "zustand";
import {
  loginUser,
  registerUser,
  getUserData,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "@/services/authService";
import { toast } from "react-toastify";
import { AuthStore } from "@/interfaces/interface";

// Centralize error handling with toast
const handleApiError = (error: unknown): string => {
  let errorMessage = "Unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  toast.error(errorMessage);
  return errorMessage;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  emailForVerification: typeof window !== "undefined" ? localStorage.getItem("emailForVerification") : null,

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await registerUser(userData);
      set({
        user: response.data,
        emailForVerification: userData.email,
        loading: false,
      });
      localStorage.setItem("emailForVerification", userData.email);
      toast.success("Registration successful! Please verify your email.");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },

  verifyEmail: async (_email, token) => {
    set({ loading: true, error: null });
  
    try {
      const storedEmail =
        get().emailForVerification || localStorage.getItem("emailForVerification");
  
      if (!storedEmail) {
        const msg = "No email available for verification. Please register again.";
        toast.error(msg);
        set({ loading: false, error: msg });
        return;
      }
  
      if (!token) {
        const msg = "Verification token is missing.";
        toast.error(msg);
        set({ loading: false, error: msg });
        return;
      }
  
      await verifyEmail(storedEmail, token);
      set({ emailForVerification: null, error: null, loading: false });
      localStorage.removeItem("emailForVerification");
  
      toast.success("Email verified successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error); // toast already called inside
      set({ error: errorMessage, loading: false });
      // Optional: display a generic fallback error toast
      if (!errorMessage.includes("already shown")) {
        toast.error("Email verification failed.");
      }
    }
  },
  

  fetchUserData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getUserData();
      set({
        user: response.data,
        isAuthenticated: true,
        loading: false,
      });
      toast.success("User data fetched successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      if (errorMessage.includes("Unauthorized")) {
        get().logoutUser();
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await loginUser(email, password);
      const accessToken = response.data?.access_Token;

      if (accessToken) {
        localStorage.setItem("access_Token", accessToken);
        await get().fetchUserData();
        set({
          user: { email, accessToken },
          isAuthenticated: true,
          loading: false,
        });
        toast.success("Logged in successfully!");
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      toast.error("Login failed. Please try again.");
    }
  },

  logoutUser: () => {
    localStorage.removeItem("access_Token");
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    toast.success("Logged out successfully");
  },

  requestPasswordReset: async (email) => {
    set({ loading: true, error: null });
    try {
      await requestPasswordReset(email);
      set({ loading: false });
      toast.success("Password reset email sent!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      toast.error("Failed to send password reset email.");
    }
  },

  resetPassword: async (token, password, confirmPassword, email) => {
    set({ loading: true, error: null });
    try {
      await resetPassword(token, password, confirmPassword, email);
      set({ loading: false });
      toast.success("Password reset successfully!");
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      toast.error("Failed to reset password.");
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("access_Token");
    if (token) {
      set({ loading: true, error: null }); // Reset error state
      try {
        await get().fetchUserData();
        set({ isAuthenticated: true, loading: false });
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        set({
          isAuthenticated: false,
          loading: false,
          error: errorMessage, // Set error state
        });
        localStorage.removeItem("access_Token");
        toast.error("Authentication initialization failed.");
        console.error("Authentication initialization failed:", error); // Add logging
      }
    } else {
      set({ loading: false }); // Ensure loading is false if no token
    }
  },
}));
