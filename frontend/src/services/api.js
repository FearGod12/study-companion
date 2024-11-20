import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, userData, {
            headers: {
                "Content-Type": "application/json", // Ensures the correct media type
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // example token
            },
        });
        console.log("User created successfully:", response.data);
        return { success: true, data: response.data }; // Handle response as needed
    } catch (error) {
        if (error.response) {
            console.error("Error creating user:", error.response.data);
            throw new Error(
                error.response.data.message || "Error creating user"
            );
        } else if (error.request) {
            console.error("No response from server:", error.request);
            throw new Error("No response from the server");
        } else {
            console.error("Error in request:", error.message);
            throw new Error("Error in request: " + error.message);
        }
    }
};

// Email Verification API
export const verifyEmail = async (email, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/users/verify-email`,
            { email, token },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            console.error("Verification error:", error.response.data);
            throw new Error(
                error.response.data.message || "Email verification failed"
            );
        } else {
            console.error("Error during email verification:", error.message);
            throw new Error(
                "Error during email verification: " + error.message
            );
        }
    }
};

// Login API
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/users/login`,
            {
                email,
                password,
            },
            {
                headers: {
                    "Content-Type": "application/json", // Ensures the correct media type
                },
            }
        );

        // Log the successful login response (token, message, etc.)
        console.log("Login successful:", response.data);

        // You may want to store the access token in localStorage or cookies for subsequent requests
        localStorage.setItem("accessToken", response.data.data.access_Token);

        // Return response data or any other info as needed
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            // Server responded with an error
            console.error("Login failed:", error.response.data);
            throw new Error(error.response.data.message || "Invalid email or password");
        } else if (error.request) {
            // No response from server
            console.error("No response from server:", error.request);
            throw new Error("No response from the server");
        } else {
            // Other errors (e.g., configuration issues)
            console.error("Request error:", error.message);
            throw new Error("Error in login request: " + error.message);
        }
    }
};