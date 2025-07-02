// src/pages/rooms/room-types.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  FaExclamationCircle,
} from "react-icons/fa";
import { RxEnterFullScreen } from "react-icons/rx";
import { IoBedOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { truncateStr } from "../../utils/truncate";
import { MdBusinessCenter } from "react-icons/md";
import { GiElephant } from "react-icons/gi";
import { useHotel } from "../../providers/hotel-provider";
import hotelClient from "../../api/hotel-client";
import { FaInfoCircle } from "react-icons/fa";

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
  const iconClass = "w-4 h-4 text-[#4A5565]"; // Using text from THEME.md's specific tag colors

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
  return <FaCheck className={iconClass} />;
};

const RoomTypes = () => {
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel();
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
    queryKey: ["roomTypesList", hotel?.id], // Use optional chaining for hotel?.id
    queryFn: async () => {
      if (!hotel?.id) {
        // Check hotel?.id directly
        throw new Error("Hotel ID is not available to fetch room types.");
      }
      // Use hotelClient for API calls
      const response = await hotelClient.get(
        `v1/room-types/?hotel_id=${hotel.id}`
      );
      const apiRooms = response.data.results;

      // Merge avg_price from hotel.room_type data
      const mergedRooms: RoomType[] = apiRooms.map((apiRoom: any) => {
        const hotelRoomMatch = hotel?.room_type?.find(
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
          image: apiRoom.image || "https://placehold.co/600x400",
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
    enabled: !!hotel?.id, // Enable when hotel.id is available
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
      // Use hotelClient for API calls
      const response = await hotelClient.get(
        `v1/room-types/${selectedRoom.id}/`
      );
      // For detailed view, get avg_price from hotel context if available, otherwise use base_price
      const hotelRoomMatch = hotel?.room_type?.find(
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

  // --- RENDER LOGIC ---
  // Use hotelLoading and hotelError from useHotel hook
  if (hotelLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-lg shadow border border-gray-200">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#553ED0] border-t-transparent mx-auto mb-4 text-[#553ED0]" />
          <p className="text-[#334155] font-semibold text-lg">
            Loading Hotel Information...
          </p>
          <p className="text-[#6B7280] text-sm mt-1">
            Getting your hotel's details to load room categories.
          </p>
        </div>
      </div>
    );
  }

  if (hotelError) {
    return (
      <div className="min-h-screen bg-[#FEF2F2] flex items-center justify-center p-4">
        <div className="bg-white border border-red-300 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaExclamationCircle className="text-4xl text-[#EF4444] mx-auto mb-4" />
          <h3 className="font-bold text-xl text-[#EF4444] mb-3">
            Error Loading Hotel!
          </h3>
          <p className="text-sm text-[#EF4444] bg-red-100 p-4 rounded-md border border-red-200">
            {hotelError || "Could not retrieve hotel information."}
          </p>
        </div>
      </div>
    );
  }

  // Fallback if hotel is null after loading (e.g., no hotel selected/found)
  if (!hotel) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white border border-amber-300 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaInfoCircle className="text-4xl text-amber-600 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-amber-800 mb-3">
            No Hotel Selected or Found
          </h3>
          <p className="text-sm text-amber-700 bg-amber-100 p-4 rounded-md border border-amber-200">
            Please ensure a hotel is selected or configured in the system to
            view room categories.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-lg shadow border border-gray-200">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#553ED0] border-t-transparent mx-auto mb-4 text-[#553ED0]" />
          <p className="text-[#334155] font-semibold text-lg">
            Loading Room Categories...
          </p>
          <p className="text-[#6B7280] text-sm mt-1">
            Fetching the latest room data for {hotel.name}.
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-300 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaExclamationCircle className="text-4xl text-[#EF4444] mx-auto mb-4" />
          <h3 className="font-bold text-xl text-[#EF4444] mb-3">
            Failed to Load Rooms!
          </h3>
          <p className="text-sm text-[#EF4444] bg-red-100 p-4 rounded-md border border-red-200">
            {error?.message ||
              "An unexpected error occurred while fetching room categories."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#DB403A] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:py-5 px-6 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-screen-2xl mx-auto">
        {/* --- Left Column: Room Types List --- */}
        <div className="lg:col-span-7 xl:col-span-8">
          <header className="mb-6">
            <h1 className="text-[1.375rem] font-bold text-[#202020] leading-tight">
              Room Categories for {hotel.name}
            </h1>
            <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
              <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
              View details for all room types available at your hotel.
            </p>
          </header>

          {/* Search and filter bar */}
          <div className="mb-6 space-y-4 bg-white p-5 rounded-[0.625rem] border border-[#E8E8E8]">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-grow w-full">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#E8E8E8]" />
                <input
                  type="text"
                  placeholder="Search by room name, description, or bed type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-[7px] bg-transparent border border-[#E8E8E8] rounded-md focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent text-[#202020] text-base font-medium transition duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#334155] transition-colors"
                    aria-label="Clear search"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-[0.9375rem] py-[0.5rem] border-[1px] rounded-full font-medium text-[0.875rem] transition-all duration-300 w-full sm:w-auto ${
                  hasActiveFilters
                    ? "bg-[#553ED0] text-white border-[#553ED0] hover:bg-[#432DBA]"
                    : "bg-white border-[#E8E8E8] text-[#838383] hover:bg-gray-100"
                }`}
              >
                <FaFilter
                  className={hasActiveFilters ? "text-white" : "text-[#553ED0]"}
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
              <div className="bg-white p-6 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#334155] text-lg">
                    Filter & Sort Options
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-[0.9375rem] py-[0.5rem] border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium flex items-center gap-1.5 transition-all hover:bg-gray-50"
                    >
                      <FaTimes className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                      className="w-full px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
                    >
                      <option value="none">No sorting</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                      className="w-full px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
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
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                      className="w-full px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
                    >
                      <option value="none">No sorting</option>
                      <option value="low-to-high">Capacity: Low to High</option>
                      <option value="high-to-low">Capacity: High to Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">
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
                      className="w-full px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
                    >
                      <option value="all">All Rooms</option>
                      <option value="available">Available Only</option>
                      <option value="full">Full Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-[#6B7280] mt-4 px-1">
              <span>
                Showing{" "}
                <span className="font-semibold text-[#334155]">
                  {filteredRooms.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#334155]">
                  {roomsTypes?.length || 0}
                </span>{" "}
                room types
                {filteredRooms.length !== 1 ? "s" : ""}
              </span>
              {hasActiveFilters && (
                <span className="text-[#0078D3] font-medium animate-pulse">
                  Filters applied
                </span>
              )}
            </div>
          </div>

          {/* Room List */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E8E8E8] shadow">
              <FaBed className="mx-auto text-5xl text-[#E8E8E8] mb-5" />
              <h3 className="text-xl font-semibold text-[#6B7280] mb-3">
                No rooms found
              </h3>
              <p className="text-[#838383] mb-6">
                {searchQuery
                  ? `No rooms match your search for "${searchQuery}"`
                  : "No rooms match your current filter criteria."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#553ED0] text-white rounded-lg hover:bg-[#432DBA] transition-colors shadow transform hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-y-5">
              {filteredRooms.map((ht) => (
                <li
                  className={`bg-[#FFF] rounded-[0.625rem] grid grid-cols-12 p-4 gap-x-6 border-[1px] border-[#E8E8E8]  transition-all duration-300 cursor-pointer hover:bg-[#FFF] ${
                    selectedRoom?.id === ht.id
                      ? "bg-[#EEF6FF] border-[#B8C1F8]" // Accent BLUE from THEME.md, subtle background
                      : "" // No specific border/bg for unselected, just the bottom border
                  }`}
                  key={ht.id}
                  onClick={() => {
                    setSelectedRoom(ht);
                  }}
                >
                  <div className="col-span-12 sm:col-span-4 md:col-span-3">
                    <img
                      className="w-full h-40 object-cover rounded-md border border-[#E8E8E8]" // Adjusted rounded and added border
                      src={ht.image}
                      alt={ht.name}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-8 md:col-span-9 flex flex-col gap-y-2 pt-4 sm:pt-0">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xl capitalize text-[#202020]">
                        {ht.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border-[1px] ${
                            ht.is_active
                              ? "bg-[#D1FAE5] text-[#059669] border-[#a8f6cf]" // Green from THEME.md
                              : "bg-[#FEF9C3] text-[#F59E0B] border-[#f6d9a6]" // Yellow/Orange from THEME.md
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              ht.is_active ? "bg-[#059669]" : "bg-[#F59E0B]"
                            }`}
                          ></div>
                          {ht.is_active ? "Available" : "Full"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[#6B7280] text-sm">
                      <span className="flex items-center gap-x-1.5">
                        <RxEnterFullScreen className="text-[#838383]" />{" "}
                        {ht.size_sqm || "N/A"}m²
                      </span>
                      <span className="flex items-center gap-x-1.5">
                        <IoBedOutline className="text-[#838383]" />{" "}
                        {ht.bed_type}
                      </span>
                      <span className="flex items-center gap-x-1.5">
                        <LuUsers className="text-[#838383]" /> Max{" "}
                        {ht.max_occupancy} Guests
                      </span>
                    </div>
                    <p className="text-[#202020] text-sm mt-1 line-clamp-2">
                      {truncateStr(ht.description, 100)}
                    </p>
                    <div className="w-full flex items-end justify-between border-t border-[#E8E8E8] pt-3 mt-auto">
                      <span className="text-[#838383] font-medium text-sm">
                        Availability:{" "}
                        <span className="text-[#553ED0] font-bold">
                          {ht.room_availability} Rooms
                        </span>
                      </span>
                      <div className="text-right">
                        <span className="text-[#202020] text-2xl font-extrabold">
                          $
                          {(ht.pricing?.avg_price !== undefined
                            ? ht.pricing.avg_price
                            : parseFloat(ht.base_price)
                          ).toFixed(2)}
                        </span>
                        <span className="text-[#838383] text-sm font-medium">
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
          <div className="bg-white rounded-xl w-full min-h-[90vh] sticky top-8 p-6 border border-[#E8E8E8]">
            {selectedRoom ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-[#E8E8E8]">
                  <div>
                    <h2 className="text-2xl font-bold capitalize text-[#202020]">
                      {selectedRoom.name}
                    </h2>
                    <p className="text-[#6B7280] text-sm">Room Details</p>
                  </div>
                </div>
                <div className="w-full h-56 rounded-lg overflow-hidden  bg-[#F8FAFC] flex items-center justify-center border border-[#E8E8E8]">
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 bg-[#F2F7FA] p-4 rounded-lg border border-[#EEF6FF]">
                  <div className="text-center">
                    <p className="text-xs text-[#838383] uppercase tracking-wider font-medium">
                      Size
                    </p>
                    <strong className="text-[#334155] font-semibold text-base mt-0.5">
                      {selectedRoom.size_sqm || "N/A"}m²
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#838383] uppercase tracking-wider font-medium">
                      Bed Type
                    </p>
                    <strong className="text-[#334155] font-semibold text-base mt-0.5">
                      {selectedRoom.bed_type}
                    </strong>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#838383] uppercase tracking-wider font-medium">
                      Max Guests
                    </p>
                    <strong className="text-[#334155] font-semibold text-base mt-0.5">
                      {selectedRoom.max_occupancy}
                    </strong>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#334155] mb-2">
                    Description
                  </h3>
                  <p className="text-[#202020] text-sm leading-relaxed bg-[#F8FAFC] p-3 rounded-md border border-[#E8E8E8]">
                    {selectedRoom.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {isLoadingDetails ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-[#6B7280] pt-8">
                      <FaSpinner className="animate-spin text-3xl text-[#553ED0]" />
                      <p className="text-base">Loading Details...</p>
                    </div>
                  ) : isDetailedError ? (
                    <div className="text-center text-[#EF4444] text-sm p-4 bg-[#FEE2E2] rounded-md border border-[#febebe]">
                      Failed to load features and amenities:{" "}
                      {detailedError?.message}
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-[#334155] mb-3">
                          Features & Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(detailedRoom?.features_list?.length || 0) > 0 ||
                          (detailedRoom?.amenities_details?.length || 0) > 0 ? (
                            <>
                              {detailedRoom?.features_list?.map((feature) => (
                                <span
                                  key={feature.id}
                                  className="flex items-center gap-2 bg-[#F2F7FA] text-[#4A5565] text-xs font-medium px-3 py-1.5 rounded-full border border-[#B8C1F8] shadow"
                                >
                                  {getFeatureIcon(feature.name)} {feature.name}
                                </span>
                              ))}
                              {detailedRoom?.amenities_details?.map(
                                (amenity) => (
                                  <span
                                    key={amenity.id}
                                    className="flex items-center gap-2 bg-[#F2F7FA] text-[#4A5565] text-xs font-medium px-3 py-1.5 rounded-full border border-[#B8C1F8] shadow"
                                  >
                                    {getFeatureIcon(amenity.name)}{" "}
                                    {amenity.name}
                                  </span>
                                )
                              )}
                            </>
                          ) : (
                            <p className="text-[#6B7280] text-sm italic bg-[#F8FAFC] p-3 rounded-md w-full border border-[#E8E8E8]">
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
                <div className="text-center text-[#6B7280] p-8 bg-white rounded-lg border border-[#E8E8E8]">
                  <FaBed className="mx-auto text-5xl text-[#E8E8E8] mb-4" />
                  <p className="font-semibold text-xl text-[#334155]">
                    Select a Room Type
                  </p>
                  <p className="text-sm mt-2 text-[#6B7280]">
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

export default RoomTypes;
