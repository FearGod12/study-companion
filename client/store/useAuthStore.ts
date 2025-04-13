import { create } from "zustand";
import { persist } from "zustand/middleware";
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
import Router from "next/router";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      emailForVerification:
        typeof window !== "undefined"
          ? localStorage.getItem("emailForVerification")
          : null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

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
        } catch {
          set({ error: 'registration failed', loading: false });
        }
      },

      verifyEmail: async (_email, token) => {
        set({ loading: true, error: null });

        try {
          const storedEmail =
            get().emailForVerification ||
            localStorage.getItem("emailForVerification");

          if (!storedEmail) {
            const msg =
              "No email available for verification. Please register again.";
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
        } catch {
          set({ error: 'Email verification failed', loading: false });
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          set({ error: "error fetching data.", loading: false });
          if (error?.response?.status === 401 || (error instanceof Error && error.message.includes("Unauthorized"))) {
            useAuthStore.getState().logoutUser();
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
            if (get().isAuthenticated) {
              Router.push("/main");
            }
          } else {
            throw new Error("Invalid response data");
          }
        } catch {
          set({ error: 'login failed', loading: false });
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
        Router.push("/auth/login");
      },

      requestPasswordReset: async (email) => {
        set({ loading: true, error: null });
        try {
          await requestPasswordReset(email);
          set({ loading: false });
          toast.success("Password reset email sent!");
        } catch {
          set({ error: 'password reset failed', loading: false });
        }
      },

      resetPassword: async (token, password, confirmPassword, email) => {
        set({ loading: true, error: null });
        try {
          await resetPassword(token, password, confirmPassword, email);
          set({ loading: false });
          toast.success("Password reset successfully!");
        } catch {
          set({ error: 'password reset failed', loading: false });
        }
      },

      initializeAuth: async () => {
        const token = localStorage.getItem("access_Token");
        if (token) {
          set({ loading: true, error: null });
          try {
            await get().fetchUserData();
            set({ isAuthenticated: true, loading: false });
          } catch {
            set({
              isAuthenticated: false,
              loading: false,
              error: 'Initialization failed',
            });
            localStorage.removeItem("access_Token");
            toast.error("Session expired. Please log in again.");
            Router.push("/auth/login");
          }
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        emailForVerification: state.emailForVerification,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
