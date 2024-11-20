import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import Button from "../common/Button";

const DashboardHeader = () => {
    // Access auth and logout function from context
    const { auth, logout } = useContext(AuthContext);

    return (
        <div className="flex justify-between items-center border h-full px-6 py-4">
            {/* Left section: Greeting with dynamic name */}
            <div>
                <h1 className="text-xl text-gray-800">
                    Hello{" "}
                    <span className="font-bold">
                        {auth?.user ? auth.user.name : "Guest"}
                    </span>
                </h1>
            </div>

            {/* Right section: Buttons and Logout */}
            <div className="flex items-center gap-6">
                {/* Link to Schedule page with Button */}
                <Link to="/schedule">
                    <Button
                        text="Add New Project"
                        className="text-white bg-primary hover:bg-primary-dark"
                    />
                </Link>

                {/* Logout Icon */}
                <button onClick={logout}>
                    <FaArrowRightFromBracket
                        size={24}
                        color="#960057"
                        className="cursor-pointer hover:text-gray-700 transition-colors"
                    />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
