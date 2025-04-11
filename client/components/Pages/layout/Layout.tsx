import { Outlet } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuthSignup";
import Loading from "../../common/Loading";
import SideMenu from "../../layout/main/SideBar";

const Layout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-inria-sans w-full h-full">
      {/* Side Menu */}
      <div className="flex-initial lg:w-64 md:w-48 w-16">
        <SideMenu />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full p-4 bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
