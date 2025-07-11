import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_Token");
    navigate("/login");
    toast.success("Logged out successfully.");
  };

  if (loading || !user) {
    return null;
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="flex justify-between items-center h-full px-4  rounded-lg">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">{currentDate}</p>
      </div>

      <div className="flex items-center lg:gap-6 gap-2">
        <div className="flex items-center gap-2">
          <span className="lg:size-8 size-6 bg-purple-400 text-white text-center rounded-full flex items-center justify-center font-bold text-xs">
            {initials}
          </span>
          <p className="lg:text-xl md:text-xl text-sm font-semibold text-gray-900 lg:block md:block hidden">
            {user.firstName} {user.lastName}
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="relative group bg-red-500 p-2 rounded-full cursor-pointer"
        >
          <FaArrowRightFromBracket color="white" className="lg:size-4 size-3"  />
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-10 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
