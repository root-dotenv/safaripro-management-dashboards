// - - - safaripro_admin/src/components/layout/sidebar-link.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
  isSubLink?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  text,
  collapsed,
  isSubLink = false,
}) => {
  const baseClasses = "flex items-center rounded-lg";
  const paddingClasses = isSubLink
    ? "py-[7px] px-[11px] text-sm"
    : "py-[10px] px-[10px]";
  const hoverClasses =
    "hover:bg-gray-100 dark:hover:bg-gray-700 text-[0.9375rem] font-medium tracking-wide";
  const activeClasses =
    "bg-[#E5E7FF] rounded-[3px] text-[#5A43D6] text-[0.9375rem] font-medium tracking-wide dark:text-blue-200";

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `text-[0.9375rem] font-medium tracking-wide ${baseClasses} ${paddingClasses} ${hoverClasses} ${
            isActive ? activeClasses : ""
          }`
        }
      >
        {icon}
        {!collapsed && <span className="ml-3">{text}</span>}
      </NavLink>
    </li>
  );
};

export default SidebarLink;
