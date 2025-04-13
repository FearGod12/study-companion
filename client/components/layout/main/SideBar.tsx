"use client";

import LightLogo from "@/components/common/logo/LightLogo";
import MenuItem from "@/components/menuBar/MenuItem";
import Pro from "@/components/menuBar/Pro";
import { FaCalendar, FaBook } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";

const SideBar = () => {
  return (
    <section className="h-full bg-accent">
      {/* Logo */}
      <div className="px-4 pt-4 flex w-20 lg:w-32 mx-auto">
        <LightLogo />
      </div>

      {/* Menu Items */}
      <ul className="flex flex-col gap-6 ml-4 mt-20">
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
      <div className="mt-10">
        <Pro />
      </div>
    </section>
  );
};

export default SideBar;
