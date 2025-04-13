import { UpdateFormValues } from "@/interfaces/interface";
import apiClient from "./apiClient";
import { handleApiError } from "@/utils/ErrorUtils";

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
    handleApiError(error);
       throw error;
     }
};

export const updateUserDetails = async (userData: UpdateFormValues) => {
  try {
    const response = await apiClient.patch("/users/me", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
