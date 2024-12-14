import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getUserData, loginUser } from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import Loading from "../components/common/Loading";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await loginUser(email, password);
      const { userData } = data.data;

      setUser(userData);
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed.");
      toast.error(err.message || "Login failed.");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await getUserData();
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_Token");

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, fetchUserData }}
    >
      {loading ? (
        <div className="container max-w-none h-screen w-screen flex items-center justify-center">
          <Loading />.
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
