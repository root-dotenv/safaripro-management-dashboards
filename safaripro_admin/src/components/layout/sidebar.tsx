// safaripro_admin/src/components/layout/sidebar.tsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiMap,
  FiNavigation,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { FaCar, FaHotel } from "react-icons/fa6";

export default function Sidebar() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null); // New state for nested sub-menus

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
    setExpandedSubMenu(null); // Close any open sub-menus when a main menu is toggled
  };

  const toggleSubMenu = (subMenu: string) => {
    setExpandedSubMenu(expandedSubMenu === subMenu ? null : subMenu);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiHome className="text-lg" />,
      path: "/",
    },
    {
      title: "Hotel Management",
      icon: <FaHotel className="text-lg" />,
      path: "/hotel-management",
      subItems: [
        { title: "Overview", path: "/hotel-management" },
        {
          title: "Hotels",
          path: "/hotel-management/hotels", // Parent path for Hotels
          nestedSubItems: [
            { title: "Available Hotels", path: "/hotel-management/hotels" },
            { title: "New Hotel", path: "/hotel-management/hotels/add-hotel" },
            {
              title: "Hotel Types",
              path: "/hotel-management/hotels/hotel-types",
            },
          ],
        },
        {
          title: "Rooms",
          path: "/hotel-management/rooms", // Parent path for Rooms
          nestedSubItems: [
            { title: "All Rooms", path: "/hotel-management/rooms" },
            {
              title: "New Room Types",
              path: "/hotel-management/rooms/add-room-type",
            },
            { title: "Room Types", path: "/hotel-management/rooms/room-types" },
          ],
        },
        {
          title: "Bookings",
          path: "/hotel-management/bookings/overview", // Parent path for Bookings
          nestedSubItems: [
            {
              title: "SafariPro Bookings",
              path: "/hotel-management/bookings/safaripro",
            },
            {
              title: "Bookings Overview",
              path: "/hotel-management/bookings/overview",
            },
          ],
        },
        {
          title: "Facilities",
          path: "/hotel-management/facilities", // Parent path for Facilities
          nestedSubItems: [
            { title: "All Facilities", path: "/hotel-management/facilities" },
            {
              title: "New Facility",
              path: "/hotel-management/facilities/add-facility",
            },
            {
              title: "Facility Types",
              path: "/hotel-management/facilities/facility-types",
            },
          ],
        },
        {
          title: "Amenities",
          path: "/hotel-management/amenities", // Parent path for Amenities
          nestedSubItems: [
            {
              title: "New Amenity",
              path: "/hotel-management/amenities/add-amenity",
            },
            { title: "All Amenities", path: "/hotel-management/amenities" },
          ],
        },
      ],
    },
    {
      title: "Car Rental",
      icon: <FaCar className="text-lg" />,
      path: "/car-rental",
      subItems: [
        { title: "Overview", path: "/car-rental" },
        { title: "Vehicles", path: "/car-rental/vehicles" },
        { title: "Bookings", path: "/car-rental/bookings" },
      ],
    },
    {
      title: "Tour Guide",
      icon: <FiMap className="text-lg" />,
      path: "/tour-guide",
      subItems: [
        { title: "Overview", path: "/tour-guide" },
        { title: "Guides", path: "/tour-guide/guides" },
        { title: "Tours", path: "/tour-guide/tours" },
      ],
    },
    {
      title: "Cab Management",
      icon: <FiNavigation className="text-lg" />,
      path: "/cab-management",
      subItems: [
        { title: "Overview", path: "/cab-management" },
        { title: "Drivers", path: "/cab-management/drivers" },
        { title: "Bookings", path: "/cab-management/bookings" },
      ],
    },
  ];

  return (
    <div className="w-[300px] bg-white shadow-md flex flex-col h-full">
      {/* - - - Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.title} className="px-2">
            {/* - - - Main Menu Item */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                expandedMenu === item.title
                  ? "bg-gray-100"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => item.subItems && toggleMenu(item.title)}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 w-full ${
                    isActive ? "text-blue-600 font-medium" : "text-gray-600"
                  }`
                }
                end
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>

              {item.subItems && (
                <span className="text-gray-500">
                  {expandedMenu === item.title ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  )}
                </span>
              )}
            </div>

            {/* - - - Submenu Items */}
            {expandedMenu === item.title && item.subItems && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <div key={subItem.title}>
                    {" "}
                    {/* Added a div to wrap subItem and its nestedSubItems */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                        expandedSubMenu === subItem.title
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        subItem.nestedSubItems && toggleSubMenu(subItem.title)
                      }
                    >
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block w-full text-sm ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                        end
                      >
                        {subItem.title}
                      </NavLink>
                      {subItem.nestedSubItems && (
                        <span className="text-gray-500">
                          {expandedSubMenu === subItem.title ? (
                            <FiChevronDown size={16} />
                          ) : (
                            <FiChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </div>
                    {/* - - - Nested Submenu Items */}
                    {expandedSubMenu === subItem.title &&
                      subItem.nestedSubItems && (
                        <div className="ml-8 mt-1 space-y-1">
                          {subItem.nestedSubItems.map((nestedSubItem) => (
                            <NavLink
                              key={nestedSubItem.path}
                              to={nestedSubItem.path}
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-lg text-sm ${
                                  isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                              }
                              end
                            >
                              {nestedSubItem.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* - - - User Profile/Footer Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@safaripro.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
