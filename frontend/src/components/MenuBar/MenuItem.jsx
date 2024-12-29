import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const MenuItem = ({ to, icon, label }) => {
  const location = useLocation(); 
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

MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
};

export default MenuItem;
