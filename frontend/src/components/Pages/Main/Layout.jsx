import { Outlet } from "react-router-dom";
import SideMenu from "../../common/SideMenu";
import { useAuth } from "../../../hooks/useAuth"; // Assuming you have useAuth
import Loading from "../../common/Loading"; 

const Layout = () => {
    const { loading, user } = useAuth();  // Get loading state from AuthContext

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loading />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <p>User not authenticated. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen font-inria-sans w-full h-full">
            {/* Side Menu */}
            <div className="flex-initial h-screen bg-secondary z-10">
                <SideMenu />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-full">
                <Outlet /> 
            </div>
        </div>
    );
};

export default Layout;
