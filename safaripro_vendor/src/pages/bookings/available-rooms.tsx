import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaBed,
  FaUsers,
  FaStar,
  FaSearch,
  FaTimes, // Added for clear search button
  FaSort, // For sortable columns
  FaSortUp, // For ascending sort
  FaSortDown, // For descending sort
  FaInfoCircle, // Added for header info icon
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"; // Added for header navigation
import React, { useState, useMemo, useEffect } from "react"; // Added React import, useMemo, useEffect
import { useHotel } from "../../providers/hotel-provider";
import CustomLoader from "../../components/ui/custom-loader"; // Import CustomLoader

// --- TYPE DEFINITIONS ---
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  average_rating: number; // Changed to number as we parse it
  review_count: number;
  room_type: string;
  hotel: string;
}

interface RoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

// Custom useDebounce Hook (copied from previous components)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Reusable No Data / Error Message Component (copied from previous components)
const NoDataMessage: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  type?: "info" | "error";
}> = ({ icon: Icon, title, description, type = "info" }) => (
  <div
    className={`p-8 rounded-xl text-center border ${
      type === "error"
        ? "bg-red-50/80 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
        : "bg-blue-50/80 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800"
    }`}
  >
    <Icon className="mx-auto h-16 w-16 mb-4 opacity-80" />
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
      {description}
    </p>
  </div>
);

export default function AvailableRooms() {
  const navigate = useNavigate();
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel(); // Destructure loading and error

  // --- STATE FOR PAGINATION, SEARCH, AND FILTERS ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce search query
  const [filters, setFilters] = useState({
    max_occupancy: "",
    min_price: "",
    max_price: "",
    min_rating: "",
  });
  const [sortColumn, setSortColumn] = useState<keyof Room | null>(null); // State for sorting
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // State for sorting direction

  // --- DATA FETCHING: AVAILABLE ROOMS ---
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
    error: roomsError,
    isPreviousData, // Helps with smoother pagination UI
    refetch: refetchRooms, // Add refetch function
  } = useQuery<RoomsResponse>({
    queryKey: [
      "availableRooms",
      hotel?.id, // Use optional chaining
      currentPage,
      debouncedSearchQuery, // Use debounced search query
      filters.max_occupancy,
      filters.min_price,
      filters.max_price,
      filters.min_rating,
    ],
    queryFn: async ({ queryKey }) => {
      const [
        ,
        hotelId,
        page,
        search,
        occupancy,
        minPrice,
        maxPrice,
        minRating,
      ] = queryKey;
      if (!hotelId) {
        throw new Error("Hotel ID is not available to fetch rooms.");
      }

      let url = `https://hotel.tradesync.software/api/v1/rooms/?hotel_id=${hotelId}&availability_status=Available&page=${page}&page_size=12`;

      if (search) {
        url += `&code=${search}`; // Searching by room code
      }
      if (occupancy) {
        url += `&max_occupancy__gte=${occupancy}`; // Filter by min occupancy
      }
      if (minPrice) {
        url += `&price_per_night__gte=${minPrice}`; // Filter by min price
      }
      if (maxPrice) {
        url += `&price_per_night__lte=${maxPrice}`; // Filter by max price
      }
      if (minRating) {
        url += `&average_rating__gte=${minRating}`; // Filter by min rating
      }

      const response = await axios.get(url);
      const results = response.data.results.map((room: any) => ({
        ...room,
        price_per_night: parseFloat(room.price_per_night),
        average_rating: parseFloat(room.average_rating),
      }));
      return { ...response.data, results };
    },
    enabled: !!hotel?.id, // Enable when hotel ID is available
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Keep previous data visible while fetching new
  });

  const handleBookRoomClick = (roomId: string) => {
    navigate(`/bookings/new-booking/${roomId}`);
  };

  const handleNextPage = () => {
    if (roomsData?.next) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (roomsData?.previous) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleSort = (column: keyof Room) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: keyof Room) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <FaSortUp className="ml-1 text-[#553ED0]" />
      ) : (
        <FaSortDown className="ml-1 text-[#553ED0]" />
      );
    }
    return <FaSort className="ml-1 text-[#838383]" />;
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      max_occupancy: "",
      min_price: "",
      max_price: "",
      min_rating: "",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    filters.max_occupancy !== "" ||
    filters.min_price !== "" ||
    filters.max_price !== "" ||
    filters.min_rating !== "";

  // Apply sorting to the fetched data
  const sortedRooms = useMemo(() => {
    if (!sortColumn || !roomsData?.results) return roomsData?.results || [];

    const sortableRooms = [...roomsData.results];
    sortableRooms.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0; // No change if types are not comparable or are mixed
    });
    return sortableRooms;
  }, [roomsData?.results, sortColumn, sortDirection]);

  // --- RENDER LOGIC: Initial Loading/Error for Hotel ---
  if (hotelLoading) {
    return <CustomLoader message="Loading Hotel Information..." />;
  }

  if (hotelError) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="Error Loading Hotel!"
        description={hotelError || "Could not retrieve hotel information."}
        type="error"
      />
    );
  }

  // Fallback if hotel is null after loading (e.g., no hotel selected/found)
  if (!hotel) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="No Hotel Selected or Found"
        description="Please ensure a hotel is selected or configured in the system to view available rooms."
        type="info"
      />
    );
  }

  if (isLoadingRooms && !isPreviousData) {
    return (
      <CustomLoader message={`Loading Available Rooms for ${hotel.name}...`} />
    );
  }

  if (isErrorRooms) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="Failed to Load Rooms!"
        description={
          roomsError?.message ||
          "An unexpected error occurred while fetching available rooms."
        }
        type="error"
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans">
      {/* Page Header - Consistent with AllRooms and HotelAmenities */}
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-2.5">
            <button>
              <IoChevronBackOutline color="#646464" size={18} />
            </button>
            <button>
              <IoChevronForwardOutline color="#646464" size={18} />
            </button>
          </div>
          <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
            Available Rooms at {hotel.name}
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
          <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
          Select an available room to proceed with a new booking.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 px-4">
        <div className="relative w-full py-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search by Room Code..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-[7px] pl-10 pr-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] hover:text-[#334155]"
              title="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <h2 className="text-xl font-semibold text-[#334155] mr-2">
            Filter Rooms:
          </h2>

          <div>
            <label
              htmlFor="max_occupancy"
              className="sr-only" // Hide label visually but keep for accessibility
            >
              Min Occupancy
            </label>
            <input
              type="number"
              id="max_occupancy"
              name="max_occupancy"
              placeholder="Min Occupancy"
              value={filters.max_occupancy}
              onChange={handleFilterChange}
              className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383] w-36"
              min="1"
            />
          </div>

          <div>
            <label
              htmlFor="min_price"
              className="sr-only" // Hide label visually but keep for accessibility
            >
              Min Price ($)
            </label>
            <input
              type="number"
              id="min_price"
              name="min_price"
              placeholder="Min Price ($)"
              value={filters.min_price}
              onChange={handleFilterChange}
              className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383] w-36"
              min="0"
            />
          </div>

          <div>
            <label
              htmlFor="max_price"
              className="sr-only" // Hide label visually but keep for accessibility
            >
              Max Price ($)
            </label>
            <input
              type="number"
              id="max_price"
              name="max_price"
              placeholder="Max Price ($)"
              value={filters.max_price}
              onChange={handleFilterChange}
              className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383] w-36"
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="min_rating"
              className="sr-only" // Hide label visually but keep for accessibility
            >
              Min Rating
            </label>
            <input
              type="number"
              id="min_rating"
              name="min_rating"
              placeholder="Min Rating (0-5)"
              value={filters.min_rating}
              onChange={handleFilterChange}
              className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383] w-40"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-[0.9375rem] py-[0.5rem] border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium flex items-center gap-1.5 transition-all hover:bg-gray-50"
            >
              <FaTimes className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {sortedRooms.length === 0 && !isLoadingRooms ? (
        <NoDataMessage
          icon={FaBed}
          title="No Available Rooms Found"
          description="No rooms match your current search or filter criteria. Try adjusting them!"
          type="info"
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            {" "}
            {/* Removed shadow-md rounded-lg */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="border-b border-[#E8E8E8]">
                  {" "}
                  {/* Removed bg-gray-50 */}
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("code")}
                  >
                    <div className="flex items-center">
                      Room Code {getSortIcon("code")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("max_occupancy")}
                  >
                    <div className="flex items-center">
                      Max Occupancy {getSortIcon("max_occupancy")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price_per_night")}
                  >
                    <div className="flex items-center">
                      Price/Night {getSortIcon("price_per_night")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("average_rating")}
                  >
                    <div className="flex items-center">
                      Rating (Reviews) {getSortIcon("average_rating")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#F9FAFC]  divide-y divide-gray-200">
                {sortedRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-md object-cover border border-[#E8E8E8]"
                          src={
                            room.image ||
                            "https://placehold.co/64x64?text=No+Image"
                          }
                          alt={room.code}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#202020]">
                        {room.code}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-sm text-[#6B7280] max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {room.description}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm text-[#202020] flex items-center gap-1">
                        <FaUsers className="text-[#553ED0]" />
                        {room.max_occupancy}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm text-[#202020] font-semibold">
                        ${room.price_per_night.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="text-sm text-[#202020] flex items-center gap-1">
                        <FaStar className="text-amber-400" />
                        <span className="font-medium text-amber-600">
                          {room.average_rating.toFixed(1)}
                        </span>{" "}
                        ({room.review_count})
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleBookRoomClick(room.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9DAFF] text-sm font-medium rounded-full text-white bg-[#553ED0] hover:bg-[#432DBA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#553ED0] transition-colors"
                      >
                        <FaBed /> Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {(roomsData?.next || roomsData?.previous) && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePreviousPage}
                disabled={!roomsData?.previous || isPreviousData}
                className={`px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium rounded-full transition-colors ${
                  !roomsData?.previous || isPreviousData
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#E5E6FF] text-[#5A43D6] hover:bg-[#D9DAFF]"
                }`}
              >
                <IoChevronBackOutline size={16} /> Prev
              </button>
              <span className="text-lg font-semibold text-[#334155]">
                Page {currentPage}
                {isLoadingRooms && isPreviousData && (
                  <FaSpinner className="animate-spin ml-2 inline-block text-[#553ED0]" />
                )}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!roomsData?.next || isPreviousData}
                className={`px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium rounded-full transition-colors ${
                  !roomsData?.next || isPreviousData
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#E5E6FF] text-[#5A43D6] hover:bg-[#D9DAFF]"
                }`}
              >
                Next <IoChevronForwardOutline size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
