import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

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
      <div className="bg-secondary py-2 rounded-xl px-6">
        <h1 className="lg:text-xl md:text-xl text-lg text-gray-100 font-ink-free">
          Welcome <span className="font-bold">{user.firstName || "User"}</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/schedule">
          <div className="bg-secondary p-2 rounded size-6 lg:size-8 flex items-center relative group">
            <FaPlus color="white" />
            <span className="absolute left-1/4 transform -translate-x-1/4 bottom-2/3 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                        Schedule
                      </span>
          </div>
        </Link>

        <button onClick={handleLogout} className="cursor-pointer size-5 lg:size-6 hover:text-gray-700 transition-colors relative group">
          <FaArrowRightFromBracket
            color="#960057"
            className=""
          />
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-2/3 mb-2 w-max px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                        Logout
                      </span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
