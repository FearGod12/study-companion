import React from 'react'
import SideMenu from '../Common/SideMenu';
import Header from '../Common/header';
import Profile from '../Common/Profile';
import Subscription from '../Common/Subscription';
import TaskList from '../Common/TaskList';
import CustomCalendar from '../Common/CustomCalendar';

const Dashboard = () => {
  return (
      <div className="container max-w-none flex h-screen font-inria-sans">
          <div className="lg:flex-initial md:flex-initial flex-1 bg-secondary w-1/6 lg:flex md:flex hidden justify-center">
              <SideMenu />
          </div>
          <div className="flex-1 bg-gray-200">
              <div className="border h-24 mx-4 rounded-lg bg-gray-100">
                  <Header />
              </div>
              <div className="flex lg:flex-row md:flex-row flex-col">
                  <div className="flex-1 border mx-4 my-4 h-60 rounded-lg bg-gray-100 flex items-center">
                      <Profile />
                  </div>
                  <div className="lg:flex-initial md:flex-initial flex-1 md:w-2/6 lg:w-2/6  border my-4 mr-4 rounded-lg bg-gray-100 flex items-center justify-center py-4  ml-4 md:ml-0 lg:ml-0">
                      <CustomCalendar />
                  </div>
              </div>
              <div className="flex lg:flex-row md:flex-row flex-col">
                  <div className="flex-1 border mx-4 h-72 mb-4 md:mb-0 lg:mb-0 bg-gray-100">
                      <TaskList />
                  </div>
                  <div className="lg:flex-initial md:flex-initial flex-1 flex items-center justify-center md:w-2/6 lg:w-2/6 border mr-4 rounded-lg bg-secondary mb-4 md:mb-0 lg:mb-0  ml-4 md:ml-0 lg:ml-0">
                      <Subscription />
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Dashboard