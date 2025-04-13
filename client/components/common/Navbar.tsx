import { useState } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Smooth scroll to section
  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="relative">
      {/* Desktop Menu */}
      <div className="hidden md:flex lg:gap-8 md:gap-6 lg:text-lg md:text-base text-sm">
        <ul className="flex gap-8 items-center">
          <li
            className="text-gray-100 hover:scale-110 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            Home
          </li>
          <li
            className="text-gray-100 hover:scale-110 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => scrollToSection("feature")}
          >
            Feature
          </li>
        </ul>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="focus:outline-none -mr-8"
          aria-label="Toggle mobile menu"
        >
          <div className="text-gray-100">
            <FaBars />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute shadow w-32 -left-20 bg-white">
          <ul className="flex flex-col px-4 gap-5 pb-6 divide-y transition ease-in-out duration-500 lg:text-lg md:text-base text-sm">
            <li
              onClick={() => scrollToSection("home")}
              className="hover:text-secondary cursor-pointer divider pt-3"
            >
              Home
            </li>
            <li
              onClick={() => scrollToSection("feature")}
              className="hover:text-secondary cursor-pointer divider pt-3"
            >
              Feature
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
