// - - - safaripro_admin/src/components/layout/top-navigation.tsx
import React, { useState } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { GiPartyPopper } from "react-icons/gi";
import { LuMessageSquareText } from "react-icons/lu";
import {
  IoChevronDown,
  IoChevronUp,
  IoNotificationsOutline,
  IoSearch,
  IoSunny,
} from "react-icons/io5";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { MdAdd } from "react-icons/md";
import { BsMoonStars } from "react-icons/bs";
// import company_logo from "../../../public/images/safari_pro_logo_black.png";
import UserProfileCard from "../ui/user-profile-card";
import QuickLinksCard from "../ui/quick-links-card";

interface TopNavbarProps {
  toggleTheme: () => void;
  currentTheme: "light" | "dark";
  logoText: string;
}

const TopNavigationBar: React.FC<TopNavbarProps> = ({
  toggleTheme,
  currentTheme,
}) => {
  // - - - Hide/Show the account details modal
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
  const handleAccountModal = () => {
    setOpenAccountModal(!openAccountModal);
    setOpenQuickActionsModal(false); // Close quick actions modal if account modal is opened
  };

  // - - - Hide/Show the quick actions modal
  const [openQuickActionsModal, setOpenQuickActionsModal] =
    useState<boolean>(false);
  const handleQuickActionsModal = () => {
    setOpenQuickActionsModal(!openQuickActionsModal);
    setOpenAccountModal(false);
  };

  return (
    <nav className="flex flex-col bg-transparent dark:bg-gray-800 w-full transition-colors duration-300 border-b-[#E8E8E8] dark:border-b-gray-700 border-b-[1.5px] relative">
      {" "}
      {/* Apply dark mode background and border */}
      {/* 1. Top-Navigation Bar */}
      <div className="bg-[rgb(43,33,106)] dark:bg-gray-900 h-[48px] w-full grid grid-cols-12">
        {" "}
        {/* Apply dark mode background */}
        {/* - - - A. Forward/Back, Searchbar, Calendar */}
        <div className="h-full flex items-center justify-center gap-x-[0.75rem] col-start-4 col-span-5">
          <div className="flex items-center gap-x-[0.75rem]">
            <button className="cursor-pointer">
              <IoArrowBack color="#FFF" size={18} />
            </button>
            <button className="cursor-pointer">
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
              className="pl-10 pr-4 py-[6px] rounded-md bg-[#483F7E] dark:bg-gray-700 text-white dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7E53FC] dark:focus:ring-blue-400 text-[0.875rem] w-[380px]"
            />
          </div>
          <button className="block p-[6px] rounded-[8px] bg-[#FFF] dark:bg-gray-700 cursor-pointer shadow">
            {" "}
            {/* Apply dark mode background */}
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
          <div className="h-[20px] bg-[#554F89] dark:bg-gray-600 w-[1.75px]"></div>{" "}
          {/* Apply dark mode background */}
          <div className="flex items-center gap-x-[1rem]">
            <button className="block cursor-pointer">
              <LuMessageSquareText color="#FFF" size={22} />
            </button>
            <button className="block cursor-pointer">
              <IoNotificationsOutline color="#FFF" size={22} />
            </button>
            <button
              onClick={handleAccountModal}
              className="flex gap-1 bg-[#483F7E] dark:bg-gray-700 items-center cursor-pointer rounded-full px-[8px] py-[4px] border-[1px] border-[#8f8f8f] dark:border-gray-600 text-[#FFF] transition-all duration-[400]" // Apply dark mode background and border
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
      <div className="bg-[#FFF] dark:bg-gray-800 w-full h-[48px] grid grid-cols-12 items-center px-[1rem]">
        {" "}
        {/* Apply dark mode background */}
        {/* - - - Static Logo */}
        <div className="col-span-5 flex gap-x-[0.75rem] items-center">
          {/* <div className="h-[2rem]">
            <img
              className="w-full h-full object-cover block"
              src={company_logo}
              alt="company_logo_black"
            />
          </div>
          <span className="font-semibold text-[1.375rem] text-[#404042] dark:text-gray-100">
            SafariPro
          </span> */}
        </div>
        {/* - - -  & Action Button */}
        <div className="col-span-7 flex gap-x-[1rem] items-center justify-end">
          <button
            onClick={handleQuickActionsModal}
            className="bg-[#6149E8] dark:bg-custom-purple gap-x-1 px-[0.9375rem] py-[6px] flex items-center gap-2 text-[0.875rem] text-[#FFF] font-medium rounded-md cursor-pointer"
          >
            <MdAdd color="#FFF" size={17} />
            New
          </button>
          {/* - - - divider */}
          <div className="h-[20px] bg-[#8f8f8f] dark:bg-gray-600 w-[1.5px]"></div>{" "}
          {/* Apply dark mode background */}
          {/* Theme mode switch */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer px-[10px] py-[8px] rounded-[8px] bg-[#F0F0F0] dark:bg-gray-700 hover:bg-[#F0F0F0] dark:hover:bg-gray-600" // Apply dark mode background and hover
          >
            {currentTheme === "dark" ? (
              <IoSunny color="#F7C322" size={18} />
            ) : (
              <BsMoonStars color="#202020" size={18} />
            )}
          </button>
          <button className="cursor-pointer">
            <HiOutlineCog6Tooth color="#202020" size={20} />
          </button>
        </div>
      </div>
      {/* - - - User Account Details Card  */}
      <UserProfileCard isOpen={openAccountModal} onClose={handleAccountModal} />
      {/* - - - Quick Actions Modal */}
      <QuickLinksCard
        isOpen={openQuickActionsModal}
        onLinkClick={handleQuickActionsModal}
      />
    </nav>
  );
};

export default TopNavigationBar;
