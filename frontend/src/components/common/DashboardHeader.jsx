import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import DarkLogo from "./DarkLogo";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const DashboardHeader = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("access_Token");
        navigate("/login");
        toast.success("Logged out successfully.");
    };

    if (loading) {
        return null;
    }

    return (
        <div className="flex justify-between items-center h-full px-6 py-4">
            <div>
                {/* Logo */}
                <div className="mb-4 mt-6">
                    <DarkLogo />
                </div>
                <h1 className="lg:text-xl md:text-xl text-sm text-gray-800">
                    Welcome{" "}
                    <span className="font-bold">
                        {user.firstName || "User"}
                    </span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/schedule">
                    <div className="bg-secondary p-2 rounded size-6 lg:size-8 flex items-center">
                        <FaPlus color="white" />
                    </div>
                </Link>

                <button onClick={handleLogout}>
                    <FaArrowRightFromBracket
                        color="#960057"
                        className="cursor-pointer size-5 lg:size-6 hover:text-gray-700 transition-colors"
                    />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
