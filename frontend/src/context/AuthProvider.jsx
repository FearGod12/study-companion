import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getUserData, loginUser } from "../services/api"; // Ensure API utilities are imported
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

// AuthProvider Component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Authenticated user's data
    const [loading, setLoading] = useState(true); // Indicates loading state
    const [error, setError] = useState(null); // Captures errors for debugging or display

    // Login function
    const login = async (email, password) => {
        try {
            const { data } = await loginUser(email, password); // Use the `loginUser` utility
            const { userData } = data.data;

            setUser(userData); // Set user data in state
            toast.success("Logged in successfully!");
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "Login failed."); // Set error for debugging/UI
            toast.error(err.message || "Login failed.");
        }
    };

    // Fetch user data function
    const fetchUserData = async () => {
        try {
            const response = await getUserData(); // Use `getUserData` utility to fetch profile
            setUser(response.data); // Set user data
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError(err.message || "Failed to fetch user data.");
            setUser(null); // Clear user data if fetch fails
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    // Initial check on mount
    useEffect(() => {
        const token = localStorage.getItem("access_Token");

        if (token) {
            fetchUserData(); // Fetch user data if a token exists
        } else {
            setLoading(false); // No token, stop loading
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, login, fetchUserData }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
