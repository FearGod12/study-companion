// components/common/menuBar/MenuItem.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MenuItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const MenuItem = ({ to, icon, label }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <Link href={to}>
      <li
        className={`flex items-center gap-3 p-4 rounded-l-full transition-all duration-300 cursor-pointer ${
          isActive ? "bg-gray-200 text-accent" : "text-gray-100"
        } hover:bg-gray-200 hover:text-accent relative group`}
      >
        {icon}
        <span className="absolute left-1/2 transform -translate-x-1/4 bottom-full mb-2 w-max px-2 py-1 text-sm text-gray-100 bg-gray-900 rounded opacity-0 group-hover:opacity-100">
          {label}
        </span>
        <span className="hidden md:block">{label}</span>
      </li>
    </Link>
  );
};

export default MenuItem;
