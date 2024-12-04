import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem("access_Token");

    if (!token) {
        // Store the current location so that we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // If the user is authenticated, render the children
};

export default ProtectedRoute;
