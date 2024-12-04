import { Outlet } from "react-router-dom";
import SideMenu from "../../common/SideMenu";
import { useState, useEffect } from "react"; 
import { useAuth } from "../../../context/useAuth"; 
import { getUserData } from "../../../services/api"; 
import Loading from "../../common/Loading"; 

const Layout = () => {
    const { user } = useAuth(); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            window.location.href = "";
        } else {
            const fetchUserData = async () => {
                try {
                    setLoading(true);
                    await getUserData(); 
                } catch (error) {
                    console.error("Error fetching user data:", error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loading/>
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
                <Outlet /> {/* Render the main content of the page */}
            </div>
        </div>
    );
};

export default Layout;
