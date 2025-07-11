import axios from "axios";
import { toast } from "react-toastify";
import { isTokenExpired } from "../utils/utils";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_Token");

        if (token && isTokenExpired(token)) {
            localStorage.removeItem("access_Token");
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login"; 
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

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            toast.error("Unauthorized. Please log in again.");
            localStorage.removeItem("access_Token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
