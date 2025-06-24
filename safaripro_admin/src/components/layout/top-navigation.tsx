import React from "react";
import {
  FaRegBell,
  FaGripVertical,
  FaSun,
  FaMoon,
  FaRegCircleUser,
} from "react-icons/fa6";
import { MdSearch } from "react-icons/md";

interface TopNavbarProps {
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
}

const TopNavigationBar: React.FC<TopNavbarProps> = ({
  toggleTheme,
  currentTheme,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md h-16 transition-colors duration-300">
      {/* Search Bar */}
      <div className="relative flex items-center w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <MdSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
      </div>

      {/* Right-aligned icons */}
      <div className="flex items-center space-x-4 pr-4">
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300">
          <FaGripVertical className="w-5 h-5" />{" "}
          {/* Quick Actions (Grids icon) */}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300">
          <FaRegBell className="w-5 h-5" /> {/* Notifications */}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300"
        >
          {currentTheme === "dark" ? (
            <FaSun className="w-5 h-5" /> // Sun icon for light theme toggle
          ) : (
            <FaMoon className="w-5 h-5" /> // Moon icon for dark theme toggle
          )}
        </button>
        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300">
          <FaRegCircleUser className="w-6 h-6" /> {/* Account Profile */}
          <span className="font-medium hidden sm:block">Admin</span>
        </button>
      </div>
    </div>
  );
};

export default TopNavigationBar;
