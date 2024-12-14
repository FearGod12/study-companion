import Profile from "../../dashboard/Profile";
import Subscription from "../../dashboard/Subscription";
import TaskList from "../../dashboard/TaskList";
import CustomCalendar from "../../dashboard/CustomCalendar";
import DashboardHeader from "../../dashboard/DashboardHeader";

const Dashboard = () => {
    return (
        <div className="h-screen flex font-inria-sans w-screen">
            {/* Main Content Area */}
            <div className="flex-1 p-4 bg-gray-200 flex flex-col h-full w-screen overflow-x-hidden">
                {/* Header Section */}
                <div className="rounded-lg bg-gray-100 ">
                    <DashboardHeader />
                </div>

                {/* Profile and Task List Section */}
                <div className="flex flex-1 lg:flex-row md:flex-row flex-col my-4">
                    <div className="flex-1 lg:mr-4 md:mr-2 mb-4 lg:mb-0 md:mb-0 h-full rounded-lg bg-gray-100 flex items-center">
                        <Profile />
                    </div>
                    <div className="lg:w-2/6 md:w-2/6 rounded-lg bg-gray-100 flex items-center justify-center py-4">
                        <TaskList />
                    </div>
                </div>

                {/* Calendar Section and Subscription Section */}
                <div className="flex flex-1 lg:flex-row md:flex-row flex-col">
                    <div className="flex-1 lg:mr-2 md:mr-2 mb-4 lg:mb-0 md:mb-0 h-full rounded-lg bg-gray-100">
                        <CustomCalendar />
                    </div>
                    <div className="lg:w-3/6 md:w-3/6 w-full rounded-lg bg-secondary flex items-center justify-center lg:ml-2 md:ml-2">
                        <Subscription />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
