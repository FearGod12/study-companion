import { Navigate} from "react-router-dom";
import { useAuth } from "../../../context/useAuth"


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Optionally handle loading state
    if (!user) return <Navigate to="/login" />; // Redirect to login if user is not authenticated

    return children; // Render protected content if user is authenticated
};

export default PrivateRoute;

