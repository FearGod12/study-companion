import { Outlet } from 'react-router-dom';
import SideMenu from '../../common/SideMenu';

const Layout = () => {
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
