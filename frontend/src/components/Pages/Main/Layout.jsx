import { Outlet } from "react-router-dom";
import SideMenu from "../../common/SideMenu";
import { useAuth } from "../../../hooks/useAuth"; 
import Loading from "../../common/Loading"; 
import Button from "../../common/Button";

const Layout = () => {
    const { loading, user } = useAuth(); 

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
                <p className="text-center text-wrap">User not authenticated. Please log in.</p>
                <Button
                text='Login'
                className="text-gray-100 hover:text-secondary hover:boder border-secondary hover:bg-gray-100 mt-6"/>
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
