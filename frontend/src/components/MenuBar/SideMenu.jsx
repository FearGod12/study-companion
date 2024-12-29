import { FaCalendar, FaBook, FaPlus } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import LightLogo from "../common/LightLogo";
import Pro from "./Pro";
import MenuItem from "./MenuItem";

const SideMenu = () => {
  return (
    <>
      {/* Menu Container */}
      <div className="h-full bg-secondary">
        {/* Menu Items */}
        <div>
          {" "}
          {/* Logo */}
          <div className="px-4 pt-4 flex w-20 md:w-32 lg:w-32 mx-auto">
            <LightLogo />
          </div>
          <div className="flex lg:bg-gray-200 md:bg-gray-200 rounded-lg justify-center py-3 mb-12 px-2 mx-auto mt-6 lg:w-36 md:w-36 gap-2 relative group">
            <h2 className="font-semibold wrap text-sm font-mono lg:block md:block hidden">
              Create New Session
            </h2>
            <div className="lg:px-3 lg:py-1 md:px-3 md:py-1 rounded-full flex justify-center items-center lg:bg-secondary md:bg-secondary bg-gray-200 lg:text-gray-100 md:text-gray-100 text-secondary p-4">
              <FaPlus size={14} />
              <span className="absolute left-1/2 transform -translate-x-1/4 bottom-full mb-2 w-max px-2 py-1 text-sm text-gray-100 bg-gray-900 rounded opacity-0 group-hover:opacity-100">
                Create Session
              </span>
            </div>
          </div>
          <ul className="flex flex-col gap-2 ml-4">
            <MenuItem
              to="/dashboard"
              icon={<RiDashboardLine size={20} />}
              label="Dashboard"
              activePath="/dashboard"
            />
            <MenuItem
              to="/schedule"
              icon={<FaCalendar size={20} />}
              label="Schedule"
              activePath="/schedule"
            />
            <MenuItem
              to="/sessions"
              icon={<FaBook size={20} />}
              label="Sessions"
              activePath="/sessions"
            />
          </ul>
          <div className="mt-4">
            <Pro />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
