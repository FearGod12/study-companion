import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleApiError = (error: unknown): string => {
  let errorMessage = "Unknown error occurred";
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message; 
    } else {
      errorMessage = "An unexpected error occurred. Please try again later.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message; 
  }
  console.error(errorMessage); 
  toast.error(errorMessage); 
  return errorMessage;
};