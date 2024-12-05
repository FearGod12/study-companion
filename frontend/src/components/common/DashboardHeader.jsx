import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import DarkLogo from "./DarkLogo";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";

const DashboardHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { user, loading } = useUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully.");
    };

    if (loading) {
        return null; // Show nothing while loading
    }

    return (
        <div className="flex justify-between items-center h-full px-6 py-4">
            <div>
                {/* Logo */}
                <div className="mb-4 ml-8">
                    <DarkLogo />
                </div>
                <h1 className="lg:text-xl md:text-xl text-sm text-gray-800">
                    Welcome{" "}
                    <span className="font-bold">
                        {user?.firstName || "User"}
                    </span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/schedule">
                    <div className="bg-secondary p-2 rounded">
                        <FaPlus color="white" />
                    </div>
                </Link>

                <button onClick={handleLogout}>
                    <FaArrowRightFromBracket
                        color="#960057"
                        className="cursor-pointer size-6 hover:text-gray-700 transition-colors"
                    />
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;
