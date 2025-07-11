import Profile from "../../dashboard/Profile";
import TaskList from "../../dashboard/TaskList";
import DashboardHeader from "../../dashboard/DashboardHeader";
import StudyStatistics from "../../dashboard/StudyStatistics";

const Dashboard = () => {
  return (
    <div className="font-sans h-full min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <DashboardHeader />
        </div>
        <div className=" bg-pink-100 rounded-lg p-4 shadow-md my-4">
          <Profile />
        </div>
        {/* Statistics Section */}
        <div className="mb-4 bg-gray-100">
          <StudyStatistics />
        </div>
        {/* Task List Section */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-md">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
