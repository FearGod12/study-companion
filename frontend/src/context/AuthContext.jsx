import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
    });

    // Check token expiry and initialize auth state on page load
    useEffect(() => {
        const checkTokenExpiry = () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const decodedToken = JSON.parse(atob(token.split(".")[1]));
                    const expiry = decodedToken.exp;
                    if (Date.now() >= expiry * 1000) {
                        logout(); // Log out if token is expired
                    } else {
                        setAuth({
                            isAuthenticated: true,
                            user: JSON.parse(localStorage.getItem("user")),
                            accessToken: token,
                        });
                    }
                } catch (err) {
                    // Handle token decoding errors
                    console.error("Token decoding error:", err);
                    logout();
                }
            }
        };

        checkTokenExpiry();
    }, []); // This will run only once on mount

    const login = (userData, token) => {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAuth({
            isAuthenticated: true,
            user: userData,
            accessToken: token,
        });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setAuth({
            isAuthenticated: false,
            user: null,
            accessToken: null,
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
