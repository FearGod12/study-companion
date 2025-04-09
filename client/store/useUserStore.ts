import { create } from "zustand";
import { uploadAvatar, updateUserDetails } from "@/services/userDataService";
import { UserStore } from "@/interfaces/interface";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const handleApiError = (error: unknown, defaultMessage: string): string => {
  return error instanceof AxiosError
    ? error.response?.data?.message || defaultMessage
    : defaultMessage;
};

export const useUserStore = create<UserStore>((set) => ({
  loading: false,
  error: null,
  successMessage: null,

  uploadAvatar: async (file: File) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await uploadAvatar(file);
      set({ loading: false, successMessage: "Avatar uploaded successfully!" });
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      toast.error(handleApiError(error, "Failed to update avatar"));
      set({
        loading: false,
        error: handleApiError(error, "Failed to update avatar"),
      });
    }
  },

  updateUserDetails: async (userData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      await updateUserDetails(userData);
      set({
        loading: false,
        successMessage: "User details updated successfully!",
      });
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      toast.error(handleApiError(error, "Failed to update avatar"));
      set({
        loading: false,
        error: handleApiError(error, "Failed to update user details"),
      });
    }
  },
}));
