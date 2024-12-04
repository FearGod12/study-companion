import { FaCalendar, FaGear, FaBars } from "react-icons/fa6";
import { RiDashboardLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import useToggle from "../../hooks/useToggle"; 

const SideMenu = () => {
    const location = useLocation();
    const [isMenuOpen, toggleMenu] = useToggle(); 

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Menu Container */}
            {isMenuOpen && (
                <div
                    className={`h-screen lg:w-48 md:w-48 w-16 bg-secondary fixed transition-all duration-300`}
                >
                    {/* Logo and Close Icon */}
                    <div className="flex items-center px-4 py-4">
                        <button onClick={toggleMenu} className="text-gray-100">
                            <FaTimesCircle size={23} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col mt-6">
                        <ul className="flex flex-col gap-4">
                            {/* Dashboard Tab */}
                            <Link to="/dashboard">
                                <li
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-300 ${
                                        isActive("/dashboard")
                                            ? "bg-gray-100 text-secondary shadow"
                                            : "text-gray-100"
                                    } hover:bg-gray-100 hover:text-secondary hover:shadow`}
                                >
                                    <RiDashboardLine size={20} />
                                    <span className="hidden md:block">
                                        Dashboard
                                    </span>
                                </li>
                            </Link>

                            {/* Schedule Tab */}
                            <Link to="/schedule">
                                <li
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-300 ${
                                        isActive("/schedule")
                                            ? "bg-gray-100 text-secondary shadow"
                                            : "text-gray-100"
                                    } hover:bg-gray-100 hover:text-secondary hover:shadow`}
                                >
                                    <FaCalendar size={20} />
                                    <span className="hidden md:block">
                                        Schedule
                                    </span>
                                </li>
                            </Link>

                            {/* Settings Tab */}
                            <Link to="/settings">
                                <li
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ease-in-out duration-300 ${
                                        isActive("/settings")
                                            ? "bg-gray-100 text-secondary shadow"
                                            : "text-gray-100"
                                    } hover:bg-gray-100 hover:text-secondary hover:shadow`}
                                >
                                    <FaGear size={20} />
                                    <span className="hidden md:block">
                                        Settings
                                    </span>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            )}

            {/* Floating Menu Icon (when menu is closed) */}
            {!isMenuOpen && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-6 left-6 text-secondary p-2 rounded-md bg-gray-100"
                >
                    <FaBars size={20} />
                </button>
            )}
        </>
    );
};

export default SideMenu;
