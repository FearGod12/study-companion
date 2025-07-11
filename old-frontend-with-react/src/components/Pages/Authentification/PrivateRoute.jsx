import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, 
};

export default PrivateRoute;
