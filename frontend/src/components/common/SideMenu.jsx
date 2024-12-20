import { FaCalendar, FaBook } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import LightLogo from "./LightLogo";
import PropTypes from "prop-types";

const SideMenu = () => {
  const location = useLocation();

  const MenuItem = ({ to, icon, label }) => {
    const isActive = location.pathname === to;

    return (
      <Link to={to}>
        <li
          className={`flex items-center gap-3 p-4 rounded-l-full transition-all duration-300 ${
            isActive ? "bg-gray-200 text-secondary" : "text-gray-100"
          } hover:bg-gray-200 hover:text-secondary relative group`}
        >
          {icon}
          <span className="absolute left-1/2 transform -translate-x-1/4 bottom-full mb-2 w-max px-2 py-1 text-sm text-gray-100 bg-gray-900 rounded opacity-0 group-hover:opacity-100">
            {label}
          </span>
          <span className="hidden md:block">{label}</span>
        </li>
      </Link>
    );
  };

  MenuItem .propTypes = {
    to: PropTypes.string.isRequired, 
    icon: PropTypes.element.isRequired, 
    label: PropTypes.string.isRequired,
    activePath: PropTypes.string.isRequired,
  };

  return (
    <>
      {/* Menu Container */}
      <div className="h-full bg-secondary">
        {/* Menu Items */}
        <div>
          {" "}
          {/* Logo */}
          <div className="px-4 pt-4 flex size-20 md:size-32 lg:size-32">
            <LightLogo />
          </div>
          <ul className="flex flex-col gap-8 ml-4">
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
        </div>
      </div>
    </>
  );
};


export default SideMenu;
