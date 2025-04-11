import Profile from "@/components/dashboard/Profile";
import TaskList from "@/components/dashboard/TaskList";
import MainHeader from "@/components/layout/main/Header";
import React, { ReactElement } from "react";
import Layout from "@/components/layout/main/layout";
import StudyStatistics from "@/components/dashboard/StatisticsData";

export default function Dashboard() {
  return (
    <section className="font-sans h-full min-h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <MainHeader />
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
    </section>
  );
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
