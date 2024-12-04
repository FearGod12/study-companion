import { useState, useEffect } from "react";
import { loginUser, getUserData } from "../services/api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
      try {
          const response = await loginUser(email, password);
          const userData = response.data;
          const token = userData?.access_Token;

          // Store token and user data in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user_data", JSON.stringify(userData));

          setUser(userData);
          toast.success("Login successful");
      } catch (error) {
          console.error("Login Error:", error.response || error.message);
          toast.error(
              error.response?.data?.message || "Failed to login. Please try again."
          );
      }
  };

  const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      // If token doesn't exist, force user to log in
      if (!token) {
          toast.error("You must be logged in to access this data.");
          return;
      }

      try {
          const response = await getUserData(token); // Pass token to get user data
          const userData = response.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
          console.error("Error fetching user data:", error.message);
          toast.error("Failed to fetch user data. Please try again.");
      } finally {
          setLoading(false);
      }
  };

  const updateUserAvatar = (avatarUrl) => {
    setUser((prevUser) => {
        const updatedUser = { ...prevUser, avatar: avatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
    });
};

  const logout = () => {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      toast.info("Logged out");
  };

  useEffect(() => {
      if (user) {
          setLoading(false); // If the user is already set, stop loading
      } else {
          fetchUserData(); // If no user is found, fetch user data
      }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, loading, login, updateUserAvatar, logout }}>
      {children}  {/* Render children components */}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,  // Ensure that children are passed as a prop
};
