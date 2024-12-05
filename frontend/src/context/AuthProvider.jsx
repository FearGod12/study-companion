import { useState, useEffect } from "react";
import { loginUser, getUserData } from "../services/api";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                // Fetch user data with token
                const response = await getUserData(token);
                setUser(response.data);
            } catch (err) {
                console.error("Auth Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const { accessToken, userData } = response.data;
            localStorage.setItem("token", accessToken);
            setUser(userData);
        } catch (err) {
            console.error("Login Error:", err);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
