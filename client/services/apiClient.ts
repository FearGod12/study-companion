import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired } from "@/utils/utils";
import { useAuthStore } from "@/store/useAuthStore";
import Router from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_Token");

    if (token) {
      if (isTokenExpired(token)) {
        useAuthStore.getState().logoutUser();
        toast.error("Session expired. Please log in again.");
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logoutUser();
      toast.error("Unauthorized. Please log in again.");
      Router.push("/auth/login");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
