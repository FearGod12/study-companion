import { Outlet } from "react-router-dom";
import SideMenu from "../../common/SideMenu";

const Layout = () => {
    return (
        <div className="container max-w-none flex h-screen font-inria-sans">
            {/* Side Menu */}
            <div className="lg:flex-initial md:flex-initial flex-1 bg-secondary w-1/6 lg:flex md:flex hidden justify-center">
                <SideMenu />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-200 p-4">
                <Outlet /> {/* Renders the selected route content */}
            </div>
        </div>
    );
};

export default Layout;
