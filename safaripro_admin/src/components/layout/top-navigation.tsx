// - - - safaripro_admin/src/components/layout/top-navigation.tsx
import React, { useState } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { GiPartyPopper } from "react-icons/gi";
import { LuMessageSquareText } from "react-icons/lu";
import {
  IoChevronDown,
  IoChevronUp,
  IoNotificationsOutline,
  IoSearch, // Imported IoSearch for the search bar
} from "react-icons/io5";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";

interface TopNavbarProps {
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
  logoText: string;
}

const TopNavigationBar: React.FC<TopNavbarProps> = ({
  toggleTheme,
  currentTheme,
  logoText,
}) => {
  // - - - Hide/Show the account details modal
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
  const handleAccountModal = () => {
    setOpenAccountModal(!openAccountModal);
  };

  return (
    <nav className="flex flex-col bg-transpareny dark:bg-gray-800 w-full transition-colors duration-300 border-b-[#E8E8E8] border-b-[1.5px] relative">
      {/* 1. Top-Navigation Bar */}
      <div className="bg-[rgb(43,33,106)] h-[48px] w-full grid grid-cols-12">
        {/* - - - A. Forward/Back, Searchbar, Calendar */}
        <div className="h-full flex items-center justify-center gap-x-[0.75rem] col-start-4 col-span-5">
          <div className="flex items-center gap-x-[0.75rem]">
            <button>
              <IoArrowBack color="#FFF" size={18} />
            </button>
            <button>
              <IoArrowForward color="#FFF" size={18} />
            </button>
          </div>
          {/* Search bar input with icon */}
          <div className="relative flex items-center">
            <IoSearch
              className="absolute left-3 text-gray-400"
              size={18}
              color="#FFF"
            />
            <input
              type="text"
              placeholder="Search for anything..."
              className="pl-10 pr-4 py-[6px] rounded-md bg-[#483F7E] text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#6290FA] text-[0.875rem] w-[380px]"
            />
          </div>
          <button className="block p-[6px] rounded-[8px] bg-[#FFF] cursor-pointer shadow">
            <IoCalendarOutline color="#838383" size={18} />
          </button>
        </div>

        {/* - - - B. Welcome,Profile, Notifications, Messages, Quick Actions(grid-menu) */}
        <div className="h-full flex items-center justify-end gap-x-[0.75rem] col-span-4 pr-[1rem]">
          <button className="bg-gradient-to-br from-[#6290FA] to-[#833FFC] px-[0.9375rem] py-[6px] flex items-center gap-2 text-[0.875rem] text-[#FFF] font-medium rounded-md cursor-pointer">
            <GiPartyPopper size={20} color="#FFF" />
            Welcome
          </button>
          <button className="cursor-pointer block">
            <CgMenuGridO color="#FFF" size={24} />
          </button>
          {/* - - - divider */}
          <div className="h-[20px] bg-[#554F89] w-[1.75px]"></div>
          <div className="flex items-center gap-x-[1rem]">
            <button className="block cursor-pointer">
              <LuMessageSquareText color="#FFF" size={22} />
            </button>
            <button className="block cursor-pointer">
              <IoNotificationsOutline color="#FFF" size={22} />
            </button>
            <button
              onClick={handleAccountModal}
              className="flex gap-1 bg-[#483F7E] items-center cursor-pointer rounded-full px-[8px] py-[4px] border-[1px] border-[#8f8f8f] text-[#FFF] transition-all duration-[400]"
            >
              <span className="text-[0.75rem] font-bold text-[#FFF] bg-[#553ED0] rounded-full px-[8px] py-[4px]">
                R
              </span>
              <span>
                {openAccountModal ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Title-Bar Sub-navigation Bar */}
      <div className="bg-[#FFFFFF] w-full h-[44px] flex">
        {/* - - - Static Logo */}
        <div className=""></div>
        {/* - - - Dynamic Page Title & Action Button */}
        <div></div>
      </div>

      {/* - - - User Account Details Card  */}
      {openAccountModal && (
        <div className="absolute top-[56px] border-[#E8E8E8] border-[1.5px] right-[1rem] w-[320px] h-[450px] bg-[#FFF] z-10 rounded-md shadow"></div>
      )}
    </nav>
  );
};

export default TopNavigationBar;
