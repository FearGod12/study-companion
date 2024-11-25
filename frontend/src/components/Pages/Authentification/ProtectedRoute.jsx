import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../../../utils/utils";

const ProtectedRoute = ({ children }) => {
    const location = useLocation(); // Get current location
    const token = localStorage.getItem("access_Token"); // Check for token

    // Redirect if no token or token is expired
    if (!token || isTokenExpired()) {
        localStorage.removeItem("access_Token"); // Clear invalid token
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render children if authenticated
    return children;
};

export default ProtectedRoute;
