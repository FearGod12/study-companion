import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("accessToken");

        if (storedUser && storedToken) {
            setUser(storedUser);
            setAccessToken(storedToken);
        } else {
            console.warn("User or token not found in local storage.");
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/login`, {
                email,
                password,
            });

            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            setAccessToken(accessToken);

            // Fetch user details after successful login
            const userResponse = await axios.get(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setUser(userResponse.data);
        } catch (error) {
            console.error("Login error:", error);
            // Handle error, e.g., display error message, redirect to error page
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    };

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const { user, accessToken, login, logout, loading } =
        useContext(AuthContext);
    return { user, accessToken, login, logout, loading };
};
