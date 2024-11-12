import { useState } from "react";
import { FaCalendar, FaGear } from "react-icons/fa6";
import LightLogo from "../../Home/Common/LightLogo";
import { RiDashboardLine } from "react-icons/ri";

const SideMenu = () => {
    const [activeTab, setActiveTab] = useState("Dashboard"); // Default active tab

    // Function to set the active tab
    const handleSetActiveTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col gap-8 pt-4">
            <LightLogo />
            <div className="text-gray-100">
                <ul className="flex flex-col gap-4">
                    <div
                        onClick={() => handleSetActiveTab("Dashboard")}
                        className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                            activeTab === "Dashboard"
                                ? "bg-gray-100 text-secondary shadow"
                                : ""
                        }`}
                    >
                        <RiDashboardLine size={20} />
                        <li className="">Dashboard</li>
                    </div>

                    <div
                        onClick={() => handleSetActiveTab("Schedule")}
                        className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                            activeTab === "Schedule"
                                ? "bg-gray-100 text-secondary shadow"
                                : ""
                        }`}
                    >
                        <FaCalendar />
                        <li className="">Schedule</li>
                    </div>

                    <div
                        onClick={() => handleSetActiveTab("Settings")}
                        className={`flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration-500 hover:bg-gray-100 hover:text-secondary hover:shadow ${
                            activeTab === "Settings"
                                ? "bg-gray-100 text-secondary shadow"
                                : ""
                        }`}
                    >
                        <FaGear />
                        <li className="">Settings</li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
