// src/pages/rooms/room-categories.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaBed,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaSpa,
  FaCheck,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaTimes,
  FaChevronDown,
  FaTrash,
  FaHotel, // Added FaHotel icon for general hotel context
  FaExclamationCircle, // Added for error messages
} from "react-icons/fa";
import { RxEnterFullScreen } from "react-icons/rx";
import { IoBedOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { truncateStr } from "../../utils/truncate";
import { MdBusinessCenter } from "react-icons/md";
import { GiElephant } from "react-icons/gi";
import { useHotel } from "../../hooks/useHotel";

// --- TYPE DEFINITIONS
interface RoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  bed_type: string;
  max_occupancy: number;
  room_availability: number; // Represents available rooms
  image: string;
  size_sqm: number | null;
  base_price: string; // The price from the API's room-types endpoint
  pricing?: {
    // Optional pricing object from hotel context
    min_price: number;
    max_price: number;
    avg_price: number;
  };
  is_active: boolean;
  features_list?: Feature[]; // Only present in detailed fetch
  amenities_details?: Amenity[]; // Only present in detailed fetch
}

interface Amenity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  amendment: string;
  icon: string | null;
  service_type: string;
  service_scope: string;
  translation: string | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface FilterState {
  priceSort: "none" | "low-to-high" | "high-to-low";
  availabilitySort: "none" | "low-to-high" | "high-to-low";
  capacitySort: "none" | "low-to-high" | "high-to-low";
  availabilityFilter: "all" | "available" | "full";
}

// --- HELPER COMPONENT FOR FEATURE/AMENITY ICONS
const getFeatureIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  const iconClass = "w-4 h-4 text-slate-500 dark:text-slate-400"; // Added dark mode class

  if (lowerName.includes("wifi")) return <FaWifi className={iconClass} />;
  if (lowerName.includes("pool"))
    return <FaSwimmingPool className={iconClass} />;
  if (lowerName.includes("restaurant") || lowerName.includes("dining"))
    return <FaUtensils className={iconClass} />;
  if (lowerName.includes("parking")) return <FaParking className={iconClass} />;
  if (lowerName.includes("safari")) return <GiElephant className={iconClass} />;
  if (
    lowerName.includes("gym") ||
    lowerName.includes("fitness") ||
    lowerName.includes("business")
  )
    return <MdBusinessCenter className={iconClass} />;
  if (lowerName.includes("spa") || lowerName.includes("tour"))
    return <FaSpa className={iconClass} />;
  return <FaCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
};

const RoomCategories = () => {
  const hotel = useHotel();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceSort: "none",
    availabilitySort: "none",
    capacitySort: "none",
    availabilityFilter: "all",
  });

  // --- DATA FETCHING (Primary Room Categories List for a specific hotel) ---
  const {
    data: roomsTypes,
    error,
    isError,
    isLoading,
  } = useQuery<RoomType[]>({
    queryKey: ["roomTypesList", hotel.data?.id],
    queryFn: async () => {
      if (!hotel.data?.id) {
        throw new Error("Hotel ID is not available to fetch room types.");
      }
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/room-types/?hotel_id=${hotel.data.id}`
      );
      const apiRooms = response.data.results;

      // Merge avg_price from hotel.room_type data
      const mergedRooms: RoomType[] = apiRooms.map((apiRoom: any) => {
        const hotelRoomMatch = hotel.data?.room_type?.find(
          (hRoom: any) => hRoom.id === apiRoom.id
        );
        return {
          id: apiRoom.id,
          name: apiRoom.name,
          code: apiRoom.code,
          description: apiRoom.description || "No description available.",
          bed_type: apiRoom.bed_type,
          max_occupancy: apiRoom.max_occupancy,
          room_availability: apiRoom.room_availability,
          image:
            apiRoom.image ||
            "https://via.placeholder.com/200x150?text=No+Image",
          size_sqm: apiRoom.size_sqm,
          base_price: String(apiRoom.base_price),
          pricing: hotelRoomMatch?.pricing,
          is_active:
            apiRoom.is_active !== undefined
              ? apiRoom.is_active
              : apiRoom.room_availability > 0,
        };
      });
      return mergedRooms;
    },
    enabled: !!hotel.data?.id, // Enable when hotel.data.id is available
  });

  // --- DATA FETCHING (Detailed Room Information for selectedRoom) ---
  const {
    data: detailedRoom,
    isLoading: isLoadingDetails,
    isError: isDetailedError,
    error: detailedError,
  } = useQuery<RoomType>({
    queryKey: ["roomDetail", selectedRoom?.id],
    queryFn: async () => {
      if (!selectedRoom?.id) {
        throw new Error("No room selected for detail fetching.");
      }
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/room-types/${selectedRoom.id}/`
      );
      // For detailed view, get avg_price from hotel context if available, otherwise use base_price
      const hotelRoomMatch = hotel.data?.room_type?.find(
        (hRoom: any) => hRoom.id === response.data.id
      );

      return {
        ...response.data,
        is_active:
          response.data.is_active !== undefined
            ? response.data.is_active
            : response.data.room_availability > 0,
        base_price: String(response.data.base_price),
        pricing: hotelRoomMatch?.pricing, // Add pricing object to detailed view
      };
    },
    enabled: !!selectedRoom?.id,
    onSuccess: (data) => {
      setSelectedRoom((prev) =>
        prev && prev.id === data.id ? { ...prev, ...data } : data
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // --- SEARCH AND FILTER LOGIC ---
  const getFilteredAndSortedRooms = (rooms: RoomType[]) => {
    let filteredRooms = [...rooms];

    if (searchQuery.trim()) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.bed_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.availabilityFilter !== "all") {
      filteredRooms = filteredRooms.filter((room) => {
        if (filters.availabilityFilter === "available") {
          return room.is_active && room.room_availability > 0;
        } else if (filters.availabilityFilter === "full") {
          return !room.is_active || room.room_availability === 0;
        }
        return true;
      });
    }

    // Determine the price to sort by: prioritize avg_price, then base_price
    const getPriceValue = (room: RoomType) =>
      parseFloat(room.pricing?.avg_price?.toFixed(2) || room.base_price);

    if (filters.priceSort !== "none") {
      filteredRooms.sort((a, b) => {
        const priceA = getPriceValue(a);
        const priceB = getPriceValue(b);
        return filters.priceSort === "low-to-high"
          ? priceA - priceB
          : priceB - priceA;
      });
    } else if (filters.availabilitySort !== "none") {
      filteredRooms.sort((a, b) => {
        return filters.availabilitySort === "low-to-high"
          ? a.room_availability - b.room_availability
          : b.room_availability - a.room_availability;
      });
    } else if (filters.capacitySort !== "none") {
      filteredRooms.sort((a, b) => {
        return filters.capacitySort === "low-to-high"
          ? a.max_occupancy - b.max_occupancy
          : b.max_occupancy - a.max_occupancy;
      });
    }

    return filteredRooms;
  };

  const filteredRooms = roomsTypes ? getFilteredAndSortedRooms(roomsTypes) : [];

  const clearFilters = () => {
    setFilters({
      priceSort: "none",
      availabilitySort: "none",
      capacitySort: "none",
      availabilityFilter: "all",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    filters.priceSort !== "none" ||
    filters.availabilitySort !== "none" ||
    filters.capacitySort !== "none" ||
    filters.availabilityFilter !== "all";

  // Effect to set the initial selected room based on filteredRooms
  useEffect(() => {
    if (!selectedRoom && filteredRooms && filteredRooms.length > 0) {
      setSelectedRoom(filteredRooms[0]);
    } else if (
      selectedRoom &&
      !filteredRooms.some((room) => room.id === selectedRoom.id)
    ) {
      setSelectedRoom(filteredRooms.length > 0 ? filteredRooms[0] : null);
    }
  }, [filteredRooms, selectedRoom]);

  // - - - DELETE ROOM CATEGORY HANDLER
  const handleDeleteRoomCategory = async (tid: string) => {
    try {
      const response = await axios.delete(
        `https://hotel.tradesync.software/api/v1/room-types/${tid}/`
      );
      console.log(`ID INSIDE OF DELETE try BLOCK`, tid);
      console.log(`- - - Delete response`, response);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  console.log(` - - - Deletion Block . . . `);

  // --- RENDER LOGIC ---
  if (hotel.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#0078D3] border-t-transparent mx-auto mb-4 text-[#0078D3] dark:text-[#4FD8EF]" />
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading Hotel Information...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Getting your hotel's details to load room categories.
          </p>
        </div>
      </div>
    );
  }

  if (hotel.isError) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaExclamationCircle className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-red-800 dark:text-red-300 mb-3">
            Error Loading Hotel!
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-md border border-red-200 dark:border-red-600">
            {hotel.error?.message || "Could not retrieve hotel information."}
          </p>
        </div>
      </div>
    );
  }

  // Fallback if hotel.data is null after loading (e.g., no hotel selected/found)
  if (!hotel.data) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-amber-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaInfoCircle className="text-4xl text-amber-600 dark:text-amber-400 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-amber-800 dark:text-amber-300 mb-3">
            No Hotel Selected or Found
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900 p-4 rounded-md border border-amber-200 dark:border-amber-600">
            Please ensure a hotel is selected or configured in the system to
            view room categories.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#0078D3] border-t-transparent mx-auto mb-4 text-[#0078D3] dark:text-[#4FD8EF]" />
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading Room Categories...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Fetching the latest room data for {hotel.data.name}.
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaExclamationCircle className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-red-800 dark:text-red-300 mb-3">
            Failed to Load Rooms!
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-md border border-red-200 dark:border-red-600">
            {error?.message ||
              "An unexpected error occurred while fetching room categories."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#DB403A] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow dark:bg-red-600 dark:hover:bg-red-500"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFB] dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-2xl mx-auto">
        {/* --- Left Column: Room Types List --- */}
        <div className="lg:col-span-7 xl:col-span-8">
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              Room Categories for {hotel.data.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              View details for all room types available at your hotel.
            </p>
          </header>

          {/* Search and filter bar */}
          <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-[#E7EBF5] dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-grow w-full">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by room name, description, or bed type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-[#0078D3] text-gray-900 dark:text-gray-100 transition duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg font-semibold text-sm shadow transition-all duration-300 w-full sm:w-auto ${
                  hasActiveFilters
                    ? "bg-[#0078D3] text-white border-[#0078D3] hover:bg-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500"
                    : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <FaFilter
                  className={
                    hasActiveFilters
                      ? "text-white"
                      : "text-[#0078D3] dark:text-[#4FD8EF]"
                  }
                />
                Filters
                <FaChevronDown
                  className={`ml-1 transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {showFilters && (
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-inner mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                    Filter & Sort Options
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#0078D3] hover:text-blue-700 dark:text-[#4FD8EF] dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort by Price
                    </label>
                    <select
                      value={filters.priceSort}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceSort: e.target.value as FilterState["priceSort"],
                          availabilitySort: "none",
                          capacitySort: "none",
                        }))
                      }
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0078D3] focus:border-[#0078D3] transition duration-200"
                    >
                      <option value="none">No sorting</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort by Availability
                    </label>
                    <select
                      value={filters.availabilitySort}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          availabilitySort: e.target
                            .value as FilterState["availabilitySort"],
                          priceSort: "none",
                          capacitySort: "none",
                        }))
                      }
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0078D3] focus:border-[#0078D3] transition duration-200"
                    >
                      <option value="none">No sorting</option>
                      <option value="low-to-high">
                        Availability: Low to High
                      </option>
                      <option value="high-to-low">
                        Availability: High to Low
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort by Capacity
                    </label>
                    <select
                      value={filters.capacitySort}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          capacitySort: e.target
                            .value as FilterState["capacitySort"],
                          priceSort: "none",
                          availabilitySort: "none",
                        }))
                      }
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0078D3] focus:border-[#0078D3] transition duration-200"
                    >
                      <option value="none">No sorting</option>
                      <option value="low-to-high">Capacity: Low to High</option>
                      <option value="high-to-low">Capacity: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filters.availabilityFilter}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          availabilityFilter: e.target
                            .value as FilterState["availabilityFilter"],
                        }))
                      }
                      className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#0078D3] focus:border-[#0078D3] transition duration-200"
                    >
                      <option value="all">All Rooms</option>
                      <option value="available">Available Only</option>
                      <option value="full">Full Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
              <span>
                Showing{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {filteredRooms.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {roomsTypes?.length || 0}
                </span>{" "}
                room
                {filteredRooms.length !== 1 ? "s" : ""}
              </span>
              {hasActiveFilters && (
                <span className="text-[#0078D3] dark:text-[#4FD8EF] font-medium animate-pulse">
                  Filters applied
                </span>
              )}
            </div>
          </div>

          {/* Room List */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow">
              <FaBed className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-5" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                No rooms found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery
                  ? `No rooms match your search for "${searchQuery}"`
                  : "No rooms match your current filter criteria."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#0B9EFF] text-white rounded-lg hover:bg-blue-700 transition-colors shadow transform hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-y-5">
              {filteredRooms.map((ht) => (
                <li
                  className={`bg-white dark:bg-gray-800 grid grid-cols-12 p-4 gap-x-6 border rounded-xl shadow transition-all duration-300 cursor-pointer hover:shadow ${
                    selectedRoom?.id === ht.id
                      ? "border-[#B8C1F8] ring-2 ring-[#B8C1F8]/50 bg-[#EEF6FF] dark:border-blue-400 dark:ring-blue-400/50 dark:bg-blue-950" // Accent BLUE
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  key={ht.id}
                  onClick={() => {
                    setSelectedRoom(ht);
                  }}
                >
                  <div className="col-span-12 sm:col-span-4 md:col-span-3">
                    <img
                      className="w-full h-40 object-cover rounded-lg shadow border border-gray-200 dark:border-gray-600"
                      src={ht.image}
                      alt={ht.name}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-8 md:col-span-9 flex flex-col gap-y-2 pt-4 sm:pt-0">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xl capitalize text-gray-900 dark:text-gray-100">
                        {ht.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            ht.is_active
                              ? "bg-[#D3F9E8] text-[#04C604] dark:bg-green-700 dark:text-green-100" // Accent GREEN
                              : "bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100" // EDAF4B
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              ht.is_active ? "bg-[#04C604]" : "bg-amber-500"
                            }`}
                          ></div>
                          {ht.is_active ? "Available" : "Full"}
                        </span>
                        {/* DELETE BUTTON ADDED HERE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRoomCategory(ht.id);
                          }}
                          className="p-2 rounded-full bg-[#F2F7FA] text-[#DB403A] hover:bg-red-200 transition-colors dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
                          aria-label={`Delete ${ht.name}`}
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 text-sm">
                      <span className="flex items-center gap-x-1.5">
                        <RxEnterFullScreen className="text-gray-400 dark:text-gray-500" />{" "}
                        {ht.size_sqm || "N/A"}m²
                      </span>
                      <span className="flex items-center gap-x-1.5">
                        <IoBedOutline className="text-gray-400 dark:text-gray-500" />{" "}
                        {ht.bed_type}
                      </span>
                      <span className="flex items-center gap-x-1.5">
                        <LuUsers className="text-gray-400 dark:text-gray-500" />{" "}
                        Max {ht.max_occupancy} Guests
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                      {truncateStr(ht.description, 100)}
                    </p>
                    <div className="w-full flex items-end justify-between border-t border-gray-200/60 dark:border-gray-700 pt-3 mt-auto">
                      <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        Availability:{" "}
                        <span className="text-[#0078D3] dark:text-[#4FD8EF] font-bold">
                          {ht.room_availability} Rooms
                        </span>
                      </span>
                      <div className="text-right">
                        <span className="text-gray-900 dark:text-gray-100 text-2xl font-extrabold">
                          $
                          {(ht.pricing?.avg_price !== undefined
                            ? ht.pricing.avg_price
                            : parseFloat(ht.base_price)
                          ).toFixed(2)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          /night
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- Right Column: Details View --- */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full min-h-[90vh] sticky top-8 shadow p-6 border border-gray-200 dark:border-gray-700">
            {selectedRoom ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Room Details
                    </p>
                  </div>
                </div>
                <div className="w-full h-56 rounded-lg overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 bg-[#F2F7FA] dark:bg-gray-700 p-4 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      Size
                    </p>
                    <strong className="text-gray-800 dark:text-gray-200 font-semibold text-base mt-0.5">
                      {selectedRoom.size_sqm || "N/A"}m²
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      Bed Type
                    </p>
                    <strong className="text-gray-800 dark:text-gray-200 font-semibold text-base mt-0.5">
                      {selectedRoom.bed_type}
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      Max Guests
                    </p>
                    <strong className="text-gray-800 dark:text-gray-200 font-semibold text-base mt-0.5">
                      {selectedRoom.max_occupancy}
                    </strong>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                    {selectedRoom.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {isLoadingDetails ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400 pt-8">
                      <FaSpinner className="animate-spin text-3xl text-[#0078D3] dark:text-[#4FD8EF]" />
                      <p className="text-base">Loading Details...</p>
                    </div>
                  ) : isDetailedError ? (
                    <div className="text-center text-red-600 dark:text-red-400 text-sm p-4 bg-red-50 dark:bg-red-900 rounded-md border border-red-200 dark:border-red-600">
                      Failed to load features and amenities:{" "}
                      {detailedError?.message}
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          Features & Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(detailedRoom?.features_list?.length || 0) > 0 ||
                          (detailedRoom?.amenities_details?.length || 0) > 0 ? (
                            <>
                              {detailedRoom?.features_list?.map((feature) => (
                                <span
                                  key={feature.id}
                                  className="flex items-center gap-2 bg-[#F2F7FA] text-[#4A5565] text-xs font-medium px-3 py-1.5 rounded-full border border-[#B8C1F8] shadow dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                                >
                                  {getFeatureIcon(feature.name)} {feature.name}
                                </span>
                              ))}
                              {detailedRoom?.amenities_details?.map(
                                (amenity) => (
                                  <span
                                    key={amenity.id}
                                    className="flex items-center gap-2 bg-[#F2F7FA] text-[#4A5565] text-xs font-medium px-3 py-1.5 rounded-full border border-[#B8C1F8] shadow dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                                  >
                                    {getFeatureIcon(amenity.name)}{" "}
                                    {amenity.name}
                                  </span>
                                )
                              )}
                            </>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm italic bg-gray-50 dark:bg-gray-700 p-3 rounded-md w-full border border-gray-100 dark:border-gray-600">
                              No features or amenities found for this room type.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400 dark:text-gray-500 p-8 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <FaBed className="mx-auto text-5xl mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="font-semibold text-xl text-gray-600 dark:text-gray-300">
                    Select a Room Type
                  </p>
                  <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                    Choose a category from the left to see its comprehensive
                    details here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCategories;
