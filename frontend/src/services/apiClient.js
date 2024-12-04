import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired } from "../utils/utils";

// Base URL from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_Token");

        if (token && isTokenExpired(token)) {
            localStorage.removeItem("access_Token");
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login"; // Redirect to login
            throw new axios.Cancel("Token expired.");
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Axios response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            toast.error("Unauthorized. Please log in again.");
            localStorage.removeItem("access_Token");
            window.location.href = "/login"; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default apiClient;
