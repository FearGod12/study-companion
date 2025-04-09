"use client";

import LightLogo from "@/components/common/logo/LightLogo";
import MenuItem from "@/components/common/menuBar/MenuItem";
import Link from "next/link";
import { FaCalendar, FaBook, FaPlus } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";

const SideBar = () => {
  return (
    <section className="h-full bg-accent">
      {/* Logo */}
      <div className="px-4 pt-4 flex w-20 md:w-32 lg:w-32 mx-auto">
        <LightLogo />
      </div>

      {/* Create Session Icon */}
      <div className="flex justify-center py-3 mb-12 px-2 mx-auto mt-6 relative group">
        <Link href="/main/schedule">
          <div className="p-3 rounded-full flex justify-center items-center bg-gray-200 hover:bg-accent transition duration-300 ease-in-out text-accent hover:text-gray-100 border-2 border-gray-100">
            <FaPlus size={16} />
          </div>
        </Link>
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm text-gray-100 bg-gray-900 rounded opacity-0 group-hover:opacity-100">
          Create Session
        </span>
      </div>

      {/* Menu Items */}
      <ul className="flex flex-col gap-4 ml-6">
        <MenuItem
          to="/main"
          icon={<RiDashboardLine size={20} />}
          label="Dashboard"
        />
        <MenuItem
          to="/main/schedule"
          icon={<FaCalendar size={20} />}
          label="Schedule"
        />
        <MenuItem
          to="/main/sessions"
          icon={<FaBook size={20} />}
          label="Sessions"
        />
      </ul>

      {/* Pro Feature */}
      {/* <div className="mt-4">
    <Pro />
  </div> */}
    </section>
  );
};

export default SideBar;
