import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { BiHotel } from "react-icons/bi";
import { BsArrowsCollapseVertical } from "react-icons/bs";
import { TbBuildingPlus, TbHelp } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";
import { PiDotsSixVertical } from "react-icons/pi";
import { MdDomainAdd } from "react-icons/md";
import {
  LuUserRoundPlus,
  LuChartNoAxesCombined,
  LuNotebookText,
  LuHotel,
  LuLayoutGrid,
} from "react-icons/lu";
import { VscTypeHierarchySuper } from "react-icons/vsc";
import { RiHotelLine } from "react-icons/ri";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";

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
      className={`h-full bg-[#FCFCFC] border-r-1 border-r-[#EAEBF1] dark:bg-gray-800 shadow-md flex flex-col transition-all duration-300 px-[0.375rem] ${
        collapsed ? "w-18" : "w-70"
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
                <LuLayoutGrid color="#404042" size={19} />
                {!collapsed && <span className="ml-3">Overview</span>}
              </NavLink>
            </li>

            {/* - - - Analytics Route */}
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive
                      ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:text-blue-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <LuChartNoAxesCombined color="#404042" size={19} />
                {!collapsed && <span className="ml-3">Analytics</span>}
              </NavLink>
            </li>

            {/* - - - Reports Route */}
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg ${
                    isActive
                      ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:text-blue-200"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <HiOutlineDocumentChartBar color="#404042" size={19} />
                {!collapsed && <span className="ml-3">Reports</span>}
              </NavLink>
            </li>

            {/* - - - Hotels Route & Subroute */}
            <li>
              <button
                onClick={() => toggleSubmenu("hotels")}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RiHotelLine color="#404042" size={19} />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">Hotels</span>
                    {openSubmenus.hotels ? (
                      <FiChevronDown className="ml-2" />
                    ) : (
                      <FiChevronUp className="ml-2" />
                    )}
                  </>
                )}
              </button>
              {!collapsed && openSubmenus.hotels && (
                <ul className="ml-8 mt-1 space-y-1">
                  <li>
                    <NavLink
                      to="/hotels/new-hotel"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <TbBuildingPlus color="#404042" size={19} />
                      <span className="ml-3">New Hotel</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/hotels/all-hotels"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <PiDotsSixVertical size={19} color="#404042" />
                      <span className="ml-3">All Hotels</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/hotels/hotel-types"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <VscTypeHierarchySuper color="#404042" size={19} />
                      <span className="ml-3">Hotel Types</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/hotels/new-hotel-types"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <MdDomainAdd color="#404042" size={19} />
                      <span className="ml-3">New Hotel&minus;Type</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* - - - Rooms Route & Subroute */}
            <li>
              <button
                onClick={() => toggleSubmenu("rooms")}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <BiHotel color="#404042" size={19} />
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
                      to="/rooms/room-types"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <VscTypeHierarchySuper color="#404042" size={19} />
                      <span className="ml-3">Room Types</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/rooms/new-room-types"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <TbBuildingPlus size={19} color="#404042" />
                      <span className="ml-3">New Room&minus;Types</span>
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
                <LuNotebookText color="#404042" size={19} className="text-lg" />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">Bookings</span>
                    {openSubmenus.bookings ? (
                      <FiChevronDown color="#404042" size={19} />
                    ) : (
                      <FiChevronUp color="#404042" size={19} />
                    )}
                  </>
                )}
              </button>
              {!collapsed && openSubmenus.bookings && (
                <ul className="ml-8 mt-1 space-y-1">
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
                      <GoChecklist color="#404042" size={19} />
                      <span className="ml-3">All Bookings</span>
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
                          src={`../../../public/images/safari_pro_logo_black.png`}
                          alt="icon"
                        />
                      </span>
                      <span className="ml-3">SafariPro Bookings</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bookings/available-rooms"
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg text-sm ${
                          isActive
                            ? "bg-[#F6F5FA] border-[0.75px] border-[#DCDCDE] rounded-[3px] dark:bg-blue-900 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <LuHotel color="#404042" size={19} />
                      <span className="ml-3">Available Rooms</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* - - - Invite & Help Buttons */}
      <div className="px-[1rem] py-[0.75rem] flex items-center border-t border-[#E8E8E8] dark:border-gray-700">
        <span className="w-full flex items-center gap-x-1 justify-center text-[0.75rem] font-medium text-[#202020]">
          <LuUserRoundPlus color="#202020" size={15} />
          Invite
        </span>
        <div className="h-[20px] w-[1.5px] bg-[#E8E8E8]"></div>
        <span className="w-full flex items-center gap-x-1 justify-center text-[0.75rem] font-medium text-[#202020]">
          <TbHelp color="#202020" size={15} />
          Help
        </span>
      </div>

      {/* - - - Collapse Button */}
      <div className="p-[1rem] border-t border-[#E8E8E8] dark:border-gray-700">
        <button
          onClick={toggleCollapse}
          className={`w-full flex items-center justify-center`}
        >
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
