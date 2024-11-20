import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation(); // Get current location
    const isAuthenticated = localStorage.getItem("accessToken"); // Check for token

    // If not authenticated, redirect to login page, passing the current location to redirect after login
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;
