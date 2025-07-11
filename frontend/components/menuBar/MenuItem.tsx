"use client";

import { MenuItemProps } from "@/interfaces";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItem = ({ to, icon, label }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to}>
      <li
        className={`flex items-center gap-3 p-3 rounded-l-full transition-all duration-300 cursor-pointer ${
          isActive ? "bg-gray-200 text-accent" : "text-gray-100"
        } hover:bg-gray-200 hover:text-accent relative group`}
      >
        {icon}
        <span className="tooltip">
          {label}
        </span>
        <span className="hidden lg:block">{label}</span>
      </li>
    </Link>
  );
};

export default MenuItem;
