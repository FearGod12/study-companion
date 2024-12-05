import { useState, useEffect } from "react";
import { getUserData } from "../services/api"; // No need for token-based API call anymore
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user data
    const fetchUserData = async () => {
        setLoading(true); // Ensure loading state is set to true before fetching
        try {
            const data = await getUserData(); // Direct API call to get user data without token
            console.log("Fetched user data:", data); // Log the fetched user data
            setUser(data.data); 
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(err.message || "Failed to fetch user data.");
        } finally {
            setLoading(false); // Set loading to false once the API request is finished
        }
    };

    useEffect(() => {
        fetchUserData(); // Fetch user data on initial load
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                fetchUserData, // Add the method to fetch user data
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
