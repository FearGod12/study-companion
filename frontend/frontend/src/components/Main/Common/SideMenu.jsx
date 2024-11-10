import { FaCalendar, FaGear } from "react-icons/fa6";
import LightLogo from "../../Home/Common/LightLogo";
import { RiDashboardLine } from "react-icons/ri";

const SideMenu = () => {
    return (
        <div className="flex flex-col gap-8 pt-4">
            <LightLogo/>
            <div className="text-gray-100">
                <ul className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration 500 hover:bg-gray-100 hover:text-secondary hover:shadow">
                        <RiDashboardLine size={20}/>
                        <li className="">Dashboard</li>
                    </div>

                    <div className="flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration 500 hover:bg-gray-100 hover:text-secondary hover:shadow">
                        <FaCalendar/>
                        <li className="">Schedule</li>
                    </div>
                    <div className="flex items-center gap-3 pl-6 pr-12 py-2 rounded-lg transition ease-in-out duration 500 hover:bg-gray-100 hover:text-secondary hover:shadow">
                        <FaGear />
                        <li className="">Settings</li>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default SideMenu;
