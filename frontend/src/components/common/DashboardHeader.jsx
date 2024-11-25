import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom"; 
import Button from "../common/Button";
import { getUserData } from "../../services/api";
import { useState, useEffect } from "react";

const DashboardHeader = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        navigate("/login");
    };

    
        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const data = await getUserData();
                    setUserData(data.data);
                } catch (error) {
                    console.error(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }, []);
    return (
        <div className="flex justify-between items-center border h-full px-6 py-4">
            <div>
                <h1 className="text-xl text-gray-800">
                    Welcome{" "}
                    <span className="font-bold">
                        {" "}
                        {userData?.firstName || "N/A"}
                    </span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/schedule">
                    <Button
                        text="Add New Project"
                        className="text-white bg-primary hover:bg-primary-dark"
                    />
                </Link>

                <button onClick={handleLogout}>
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
