import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="relative">
            {/* Desktop Menu */}
            <div className="hidden md:flex lg:gap-8 md:gap-6 font-inria-sans text-sm">
                <ul className="flex gap-6">
                    <li className="hover:text-secondary cursor-pointer">
                        Home
                    </li>
                    <li className="hover:text-secondary cursor-pointer">
                        Feature
                    </li>
                    <li className="hover:text-secondary cursor-pointer">
                        About Us
                    </li>
                    <li className="hover:text-secondary cursor-pointer">
                        Contact
                    </li>
                </ul>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleMobileMenu}
                    className="focus:outline-none"
                >
                    {/* Hamburger Icon */}
                  <FaBars/>  
                </button>
                
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute shadow w-40 -left-16 bg-white">
                    <ul className="flex flex-col px-4 pt-9 gap-5 font-inria-sans pb-6 divide-y transition ease-in-out duration-500">
                        <li
                            onClick={toggleMobileMenu}
                            className="hover:text-secondary cursor-pointer divider pt-3 "
                        >
                            Home
                        </li>
                        <li
                            onClick={toggleMobileMenu}
                            className="hover:text-secondary cursor-pointer divider pt-3 "
                        >
                            Feature
                        </li>
                        <li
                            onClick={toggleMobileMenu}
                            className="hover:text-secondary cursor-pointer divider pt-3 "
                        >
                            About Us
                        </li>
                        <li
                            onClick={toggleMobileMenu}
                            className="hover:text-secondary cursor-pointer divide-y pt-3 "
                        >
                            Contact
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
