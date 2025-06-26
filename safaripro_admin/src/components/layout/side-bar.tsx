// - - - safaripro_admin/src/components/layout/side-bar.tsx
import { useState } from "react";
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
import SidebarLink from "./sidebar-link";
import SidebarSubMenu from "./sidebar-submenu";
interface SideBarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export default function SideBar({ collapsed, toggleCollapse }: SideBarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    hotels: true,
    rooms: false,
    bookings: true,
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
          <ul className="space-y-[6px] px-2">
            {/* - - - Overview Route */}
            <SidebarLink
              to="/"
              icon={<LuLayoutGrid color="#404042" size={19} />}
              text="Overview"
              collapsed={collapsed}
            />

            {/* - - - Analytics Route */}
            <SidebarLink
              to="/analytics"
              icon={<LuChartNoAxesCombined color="#404042" size={19} />}
              text="Analytics"
              collapsed={collapsed}
            />

            {/* - - - Reports Route */}
            <SidebarLink
              to="/reports"
              icon={<HiOutlineDocumentChartBar color="#404042" size={19} />}
              text="Reports"
              collapsed={collapsed}
            />

            {/* - - - Hotels Route & Subroute */}
            <SidebarSubMenu
              title="Hotels"
              icon={<RiHotelLine color="#404042" size={19} />}
              collapsed={collapsed}
              isOpen={openSubmenus.hotels}
              onToggle={() => toggleSubmenu("hotels")}
            >
              <SidebarLink
                to="/hotels/new-hotel"
                icon={<TbBuildingPlus color="#404042" size={19} />}
                text="New Hotel"
                collapsed={collapsed}
                isSubLink
              />
              <SidebarLink
                to="/hotels/all-hotels"
                icon={<PiDotsSixVertical size={19} color="#404042" />}
                text="All Hotels"
                collapsed={collapsed}
                isSubLink
              />
              <SidebarLink
                to="/hotels/hotel-types"
                icon={<VscTypeHierarchySuper color="#404042" size={19} />}
                text="Hotel Types"
                collapsed={collapsed}
                isSubLink
              />
              <SidebarLink
                to="/hotels/new-hotel-types"
                icon={<MdDomainAdd color="#404042" size={19} />}
                text="New Hotel-Type"
                collapsed={collapsed}
                isSubLink
              />
            </SidebarSubMenu>

            {/* - - - Rooms Route & Subroute */}
            <SidebarSubMenu
              title="Rooms"
              icon={<BiHotel color="#404042" size={19} />}
              collapsed={collapsed}
              isOpen={openSubmenus.rooms}
              onToggle={() => toggleSubmenu("rooms")}
            >
              <SidebarLink
                to="/rooms/room-types"
                icon={<VscTypeHierarchySuper color="#404042" size={19} />}
                text="Room Types"
                collapsed={collapsed}
                isSubLink
              />
              <SidebarLink
                to="/rooms/new-room-types"
                icon={<TbBuildingPlus size={19} color="#404042" />}
                text="New Room-Types"
                collapsed={collapsed}
                isSubLink
              />
            </SidebarSubMenu>

            {/* - - - Bookings Route & Subroute */}
            <SidebarSubMenu
              title="Bookings"
              icon={<LuNotebookText color="#404042" size={19} />}
              collapsed={collapsed}
              isOpen={openSubmenus.bookings}
              onToggle={() => toggleSubmenu("bookings")}
            >
              <SidebarLink
                to="/bookings/all-bookings"
                icon={<GoChecklist color="#404042" size={19} />}
                text="All Bookings"
                collapsed={collapsed}
                isSubLink
              />
              {/* Special case for SafariPro Bookings due to custom image icon */}
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
                      src={`../../../public/images/safari_pro_logo.png`}
                      alt="icon"
                    />
                  </span>
                  <span className="ml-3  text-[#F38C51] text-[0.9375rem] font-medium tracking-wide ">
                    SafariPro Bookings
                  </span>
                </NavLink>
              </li>
              <SidebarLink
                to="/bookings/available-rooms"
                icon={<LuHotel color="#404042" size={19} />}
                text="Available Rooms"
                collapsed={collapsed}
                isSubLink
              />
            </SidebarSubMenu>

            {/* - - - Rooms Route & Subroute */}
            <SidebarSubMenu
              title="Amenities"
              icon={<BiHotel color="#404042" size={19} />}
              collapsed={collapsed}
              isOpen={openSubmenus.amenities}
              onToggle={() => toggleSubmenu("amenities")}
            >
              <SidebarLink
                to="/amenities"
                icon={<VscTypeHierarchySuper color="#404042" size={19} />}
                text="Hotel Amenities"
                collapsed={collapsed}
                isSubLink
              />
              <SidebarLink
                to="/amenities/new-amenity"
                icon={<TbBuildingPlus size={19} color="#404042" />}
                text="Create New Amenity"
                collapsed={collapsed}
                isSubLink
              />
            </SidebarSubMenu>
          </ul>
        </nav>
      </div>

      {/* - - - Invite & Help Buttons */}
      <div className="px-[1rem] py-[0.75rem] flex items-center border-t border-[#E8E8E8] dark:border-gray-700">
        <span className="w-full flex items-center gap-x-1 justify-center text-[0.875rem] font-medium text-[#202020]">
          <LuUserRoundPlus color="#202020" size={15} />
          Invite
        </span>
        <div className="h-[20px] w-[1.5px] bg-[#E8E8E8]"></div>
        <span className="w-full flex items-center gap-x-1 justify-center text-[0.875rem] font-medium text-[#202020]">
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
