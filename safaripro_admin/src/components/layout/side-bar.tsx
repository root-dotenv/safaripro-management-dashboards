import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { IoGridOutline } from "react-icons/io5";
import { BiHotel } from "react-icons/bi";
import { HiOutlineTicket } from "react-icons/hi2";
import { BsArrowsCollapseVertical } from "react-icons/bs";
import { TbBuildingPlus, TbSitemap } from "react-icons/tb";
import { LuUserPlus } from "react-icons/lu";
import { GoChecklist } from "react-icons/go";
import { PiDotsSixVertical } from "react-icons/pi";
import { MdDomainAdd } from "react-icons/md";

interface SideBarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export default function SideBar({ collapsed, toggleCollapse }: SideBarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    rooms: false,
    bookings: false,
  });

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside
      className={`h-full bg-[#FFF] border-r-1 border-r-[#DCDCDE] dark:bg-gray-800 shadow-md flex flex-col transition-all duration-300 px-[0.375rem] ${
        collapsed ? "w-18" : "w-72"
      }`}
    >
      <div className="flex-1 overflow-y-auto py-2">
        {/* - - - Main Navigation */}
        <nav>
          <ul className="space-y-1 px-2">
            {/* - - - Overview Route */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive
                      ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:text-blue-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <IoGridOutline color="#404042" size={20} />
                {!collapsed && <span className="ml-3">Overview</span>}
              </NavLink>
            </li>

            {/* - - - Rooms Route & Subroute */}
            <li>
              <NavLink
                to="/guests"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px]"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiUser color="#404042" size={20} />
                {!collapsed && <span className="ml-3">Guests</span>}
              </NavLink>
            </li>

            {/* - - - Rooms Route & Subroute */}
            <li>
              <button
                onClick={() => toggleSubmenu("rooms")}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BiHotel color="#404042" size={20} />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">Rooms</span>
                    {openSubmenus.rooms ? (
                      <FiChevronDown className="ml-2" />
                    ) : (
                      <FiChevronUp className="ml-2" />
                    )}
                  </>
                )}
              </button>
              {!collapsed && openSubmenus.rooms && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/rooms/add-room"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <TbBuildingPlus color="#404042" size={20} />
                      <span className="ml-3">Add Room</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rooms/room-categories"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <TbSitemap size={20} color="#404042" />
                      <span className="ml-3">Room Categories</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rooms/all-rooms"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <PiDotsSixVertical color="#404042" size={20} />
                      <span className="ml-3">All Rooms</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rooms/add-categories"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <MdDomainAdd color="#404042" size={20} />
                      <span className="ml-3">New Room&minus;Type</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* - - - Bookings Route & Subroute */}
            <li>
              <button
                onClick={() => toggleSubmenu("bookings")}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiOutlineTicket
                  color="#404042"
                  size={20}
                  className="text-lg"
                />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">Bookings</span>
                    {openSubmenus.bookings ? (
                      <FiChevronDown color="#404042" size={20} />
                    ) : (
                      <FiChevronUp color="#404042" size={20} />
                    )}
                  </>
                )}
              </button>
              {!collapsed && openSubmenus.bookings && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/bookings/new-booking"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <LuUserPlus color="#404042" size={20} />
                      <span className="ml-3">New Booking</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bookings/safaripro-bookings"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <span className={`block w-5 h-5 p-0`}>
                        <img
                          className="w-full h-full object-cover"
                          src={`../../../public/images/safari-pro-logo.png`}
                          alt="icon"
                        />
                      </span>
                      <span className="ml-3">SafariPro Bookings</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bookings/all-bookings"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <GoChecklist color="#404042" size={20} />
                      <span className="ml-3">All Bookings</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* - - - Collapse Button */}
      <div className="p-[1rem] border-t border-[#DCDCDE] dark:border-gray-700">
        <button onClick={toggleCollapse} className={`w-full flex items-center`}>
          {collapsed ? (
            <BsArrowsCollapseVertical color="#404042" size={24} />
          ) : (
            <>
              <BsArrowsCollapseVertical color="#404042" size={24} />
              <span className="ml-3">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
