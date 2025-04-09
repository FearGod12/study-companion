import { UpdateFormValues } from "@/interfaces/interface";
import apiClient from "./apiClient";
import { AxiosError } from "axios";

export const uploadAvatar = async (file: File) => {
  if (!file) throw new Error("No file provided for upload.");

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.patch("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to update avatar", error);
      throw new Error(
        error.response?.data?.message || "Failed to update avatar"
      );
    }
    throw error;
  }
};

export const updateUserDetails = async (userData: UpdateFormValues) => {
  try {
    const response = await apiClient.patch("/users/me", userData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to update user data", error);
      throw new Error(
        error.response?.data?.message || "Failed to update user data"
      );
    }
    throw error;
  }
};
