// - - - safaripro_admin/src/components/layout/sidebar-submenu.tsx
import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SidebarSubMenuProps {
  title: string;
  icon: React.ReactNode;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({
  title,
  icon,
  collapsed,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <li>
      <button
        onClick={onToggle}
        className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {icon}
        {!collapsed && (
          <>
            <span className="ml-3 flex-1 text-left">{title}</span>
            {isOpen ? (
              <FiChevronUp className="ml-2" />
            ) : (
              <FiChevronDown className="ml-2" />
            )}
          </>
        )}
      </button>
      {!collapsed && isOpen && (
        <ul className="ml-8 mt-1 space-y-1">{children}</ul>
      )}
    </li>
  );
};

export default SidebarSubMenu;
