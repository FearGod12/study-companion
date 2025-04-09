import { ReactNode } from "react";
import SideBar from "./SideBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full h-full">
       <div className="flex-initial lg:w-64 md:w-48 w-16">
      <SideBar />
      </div>
      <div className="flex-1 h-full p-4 bg-gray-200">
         <main>{children}</main>
      </div>
     
    </div>
  );
};

export default Layout;
