import { useState } from "react";
import { FaCalendar, FaGear, FaBars } from "react-icons/fa6"; // Add hamburger and close icons
import LightLogo from "./LightLogo";
import { RiDashboardLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const SideMenu = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu on small screens

    // Check if the current path matches the route to determine active tab
    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle menu visibility

    return (
        <div className="flex flex-col gap-8 pt-4 w-full">
            {/* Logo and Hamburger Toggle Button for Mobile */}
            <div className="lg:hidden flex justify-between items-center px-6">
                <LightLogo />
                <button onClick={toggleMenu} className="text-gray-100">
                    {isMenuOpen ? (
                        <FaTimes size={30} /> // Close icon when menu is open
                    ) : (
                        <FaBars size={30} /> // Hamburger icon when menu is closed
                    )}
                </button>
            </div>

            {/* Menu Items */}
            <div
                className={`lg:flex flex-col gap-4 text-gray-100 w-full lg:w-auto transition-all duration-300 ${
                    isMenuOpen ? "block" : "hidden" // Show menu on mobile if isMenuOpen is true
                }`}
            >
                <ul className="flex flex-col gap-4">
                    {/* Dashboard Tab */}
                    <Link to="/dashboard">
                        <div
                            className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                                isActive("/dashboard")
                                    ? "bg-gray-100 text-secondary shadow"
                                    : ""
                            }`}
                        >
                            <RiDashboardLine size={20} />
                            <li>Dashboard</li>
                        </div>
                    </Link>

                    {/* Schedule Tab */}
                    <Link to="/schedule">
                        <div
                            className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                                isActive("/schedule")
                                    ? "bg-gray-100 text-secondary shadow"
                                    : ""
                            }`}
                        >
                            <FaCalendar />
                            <li>Schedule</li>
                        </div>
                    </Link>

                    {/* Settings Tab */}
                    <Link to="/settings">
                        <div
                            className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                                isActive("/settings")
                                    ? "bg-gray-100 text-secondary shadow"
                                    : ""
                            }`}
                        >
                            <FaGear />
                            <li>Settings</li>
                        </div>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
