import Profile from "../../common/Profile";
import Subscription from "../../common/Subscription";
import TaskList from "../../common/TaskList";
import CustomCalendar from "../../common/CustomCalendar";
import DashboardHeader from "../../common/DashboardHeader";

const Dashboard = () => {
    return (
        <div className="container max-w-none flex lg:h-screen md:h-screen h-full font-inria-sans">
            {/* Main Content Area */}
            <div className="flex-1 bg-gray-200 h-full">
                {/* Header Section */}
                <div className="border h-24 rounded-lg bg-gray-100">
                    <DashboardHeader />
                </div>

                {/* Profile and Task List Section */}
                <div className="flex lg:flex-row md:flex-row flex-col my-4">
                    <div className="flex-1 border mr-2 lg:my-4 md:my-4 mt-4 h-60 rounded-lg bg-gray-100 flex items-center">
                        <Profile />
                    </div>
                    <div className="lg:flex-initial md:flex-initial flex-1 md:w-2/6 lg:w-2/6 border my-4 rounded-lg bg-gray-100 flex items-center justify-center py-4 ml-2 md:ml-0 lg:ml-0">
                        <TaskList />
                    </div>
                </div>

                {/* Task List Section and Subscription Section */}
                <div className="flex lg:flex-row md:flex-row flex-col">
                    <div className="flex-1 border mr-2 h-72 mb-4 md:mb-0 lg:mb-0 bg-gray-100">
                        <CustomCalendar />
                    </div>
                    <div className="lg:flex-initial md:flex-initial flex-1 flex items-center justify-center md:w-2/6 lg:w-2/6 border rounded-lg bg-secondary mb-4 md:mb-0 lg:mb-0 ml-2 md:ml-0 lg:ml-0">
                        <Subscription />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
