// all-rooms.tsx
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { AxiosError } from "axios";
import { Pagination } from "../../components/ui/pagination";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaTools,
  FaCalendarTimes,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaImage,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaStar,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { FiAlertTriangle } from "react-icons/fi";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import hotelClient from "../../api/hotel-client";
import { PiDotsSixVertical } from "react-icons/pi";
import { IoAddOutline } from "react-icons/io5";

// --- TYPE DEFINITIONS ---
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  average_rating: number;
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

const ITEMS_PER_PAGE = 20; // Changed from 12 to 20

// --- Custom useDebounce Hook ---
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

// --- Reusable No Data / Error Message Component ---
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

export default function AllRooms() {
  const hotel_ID = import.meta.env.VITE_HOTEL_ID;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // - - - State Management
  const [activeTab, setActiveTab] = useState<
    "available" | "booked" | "maintenance"
  >("available");
  const [availableCurrentPage, setAvailableCurrentPage] = useState(1);
  const [bookedCurrentPage, setBookedCurrentPage] = useState(1);
  const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    maxOccupancy: "",
    search: "",
    // sortOrder: "", // Removed sortOrder state
  });

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // --- Helper to build common query parameters ---
  const getCommonQueryParams = (page: number, searchTerm: string) => ({
    hotel_id: hotel_ID,
    page: page,
    page_size: ITEMS_PER_PAGE,
    ...(searchTerm && { search: searchTerm }),
    ...(filters.maxOccupancy && { max_occupancy: filters.maxOccupancy }),
    // ...(filters.sortOrder && { sort: filters.sortOrder }), // Removed sort parameter
  });

  // --- Generic fetch function for rooms with parsing ---
  const fetchRooms = async (
    availabilityStatus: string,
    page: number,
    searchTerm: string
    // sortOrder: string // Removed sortOrder parameter
  ): Promise<RoomsResponse> => {
    const params = {
      ...getCommonQueryParams(page, searchTerm),
      availability_status: availabilityStatus,
    };
    const response = await hotelClient.get<RoomsResponse>(`v1/rooms/`, {
      params,
    });
    const results = response.data.results.map((room: any) => ({
      ...room,
      price_per_night: parseFloat(room.price_per_night) || 0,
      average_rating: parseFloat(room.average_rating) || 0,
    }));
    return { ...response.data, results };
  };

  // --- Data Fetching for AVAILABLE Rooms ---
  const {
    data: availableRoomsResponse,
    isLoading: isLoadingAvailable,
    isError: isErrorAvailable,
    error: errorAvailable,
  } = useQuery<RoomsResponse, AxiosError>({
    queryKey: [
      "rooms",
      "Available",
      availableCurrentPage,
      filters.maxOccupancy,
      debouncedSearchTerm,
      // filters.sortOrder, // Removed sortOrder from query key
    ],
    queryFn: () =>
      fetchRooms(
        "Available",
        availableCurrentPage,
        debouncedSearchTerm
        // filters.sortOrder // Removed sortOrder from fetchRooms call
      ),
    keepPreviousData: true,
    enabled: !!hotel_ID,
  });

  // --- Data Fetching for BOOKED Rooms ---
  const {
    data: bookedRoomsResponse,
    isLoading: isLoadingBooked,
    isError: isErrorBooked,
    error: errorBooked,
  } = useQuery<RoomsResponse, AxiosError>({
    queryKey: [
      "rooms",
      "Booked",
      bookedCurrentPage,
      filters.maxOccupancy,
      debouncedSearchTerm,
      // filters.sortOrder, // Removed sortOrder from query key
    ],
    queryFn: () =>
      fetchRooms(
        "Booked",
        bookedCurrentPage,
        debouncedSearchTerm
        // filters.sortOrder // Removed sortOrder from fetchRooms call
      ),
    keepPreviousData: true,
    enabled: !!hotel_ID,
  });

  // --- Data Fetching for UNDER MAINTENANCE Rooms ---
  const {
    data: maintenanceRoomsResponse,
    isLoading: isLoadingMaintenance,
    isError: isErrorMaintenance,
    error: errorMaintenance,
  } = useQuery<RoomsResponse, AxiosError>({
    queryKey: [
      "rooms",
      "Maintenance",
      maintenanceCurrentPage,
      filters.maxOccupancy,
      debouncedSearchTerm,
      // filters.sortOrder, // Removed sortOrder from query key
    ],
    queryFn: () =>
      fetchRooms(
        "Maintenance",
        maintenanceCurrentPage,
        debouncedSearchTerm
        // filters.sortOrder // Removed sortOrder from fetchRooms call
      ),
    keepPreviousData: true,
    enabled: !!hotel_ID,
  });

  // --- Data Processing (for filter options) ---
  const allRoomsForFilterOptions = useMemo(() => {
    return (availableRoomsResponse?.results || [])
      .concat(bookedRoomsResponse?.results || [])
      .concat(maintenanceRoomsResponse?.results || []);
  }, [availableRoomsResponse, bookedRoomsResponse, maintenanceRoomsResponse]);

  const uniqueMaxOccupancies = useMemo(
    () =>
      [
        ...new Set(allRoomsForFilterOptions.map((room) => room.max_occupancy)),
      ].sort((a, b) => a - b),
    [allRoomsForFilterOptions]
  );
  const uniqueRoomTypes = useMemo(
    () => [...new Set(allRoomsForFilterOptions.map((room) => room.room_type))],
    [allRoomsForFilterOptions]
  );

  // --- Delete Room Mutation ---
  const deleteRoomMutation = useMutation<void, AxiosError, string>({
    mutationFn: async (roomId: string) => {
      console.log(`- - - Debugging Deleting Room`);
      const delResponse = await hotelClient.delete(`v1/rooms/${roomId}/`);
      console.log(delResponse);
    },
    onSuccess: () => {
      toast.success("Room deleted successfully!");
      // Invalidate queries to refetch data for all tabs
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to delete room.";
      toast.error(`Error: ${errorMessage}`);
    },
  });

  // --- Event Handlers ---
  const handleFilterChange = (
    filterType: "maxOccupancy" | "search", // Updated filter types (removed sortOrder)
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setAvailableCurrentPage(1);
    setBookedCurrentPage(1);
    setMaintenanceCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      maxOccupancy: "",
      search: "",
      // sortOrder: "", // Removed sort order
    });
    setAvailableCurrentPage(1);
    setBookedCurrentPage(1);
    setMaintenanceCurrentPage(1);
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/details/${roomId}`);
  };

  const handleEditClick = (roomId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/rooms/edit/${roomId}`);
  };

  const handleDeleteClick = (roomId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    ) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  // --- Centralized Error and Loading Renderers ---
  const renderStatusOrError = (
    isLoading: boolean,
    isError: boolean,
    error: AxiosError | null,
    tabName: string
  ) => {
    if (isLoading) {
      return (
        <NoDataMessage
          icon={FaSpinner}
          title={`Loading ${tabName} Rooms...`}
          description="Fetching the latest room data."
          type="info"
        />
      );
    }
    if (isError) {
      let errorMessage = "An unexpected error occurred.";
      if (error?.response?.status === 404) {
        errorMessage = `No data found for ${tabName} rooms. The requested resource might not exist.`;
      } else if (error?.response?.status === 400) {
        errorMessage = `Invalid request for ${tabName} rooms. Please check your filters.`;
      } else if (error?.message) {
        errorMessage = `Network Error: ${error.message}. Please try again later.`;
      }
      return (
        <NoDataMessage
          icon={FiAlertTriangle}
          title={`Failed to Load ${tabName} Rooms!`}
          description={errorMessage}
          type="error"
        />
      );
    }
    return null; // No loading or error, proceed to render table
  };

  const renderTable = (
    rooms: Room[],
    isLoading: boolean,
    isError: boolean,
    error: AxiosError | null,
    totalCount: number,
    currentPage: number,
    onPageChange: (page: number) => void,
    emptyMessage: string,
    emptyIcon: React.ElementType
  ) => {
    const statusContent = renderStatusOrError(
      isLoading,
      isError,
      error,
      emptyMessage.replace("No ", "").replace(" found", "")
    );

    if (statusContent) {
      return statusContent;
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full bg-transparent">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">CODE</div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">
                    <FaImage className="mr-2 text-[#838383]" />
                    IMAGE
                  </div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">
                    <FaDollarSign className="mr-2 text-[#838383]" />
                    PRICE
                  </div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">
                    <FaUsers className="mr-2 text-[#838383]" />
                    MAX OCCUPANCY
                  </div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-[#838383]" />
                    STATUS
                  </div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  <div className="flex items-center">
                    <FaStar className="mr-2 text-[#838383]" />
                    RATING
                  </div>
                </th>
                <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#6B7280]">
                    {filters.search || filters.maxOccupancy ? ( // Updated condition (removed sortOrder)
                      `No ${emptyMessage
                        .toLowerCase()
                        .replace("no ", "")
                        .replace(
                          " found",
                          ""
                        )} matching your search or filter criteria.`
                    ) : (
                      <NoDataMessage
                        icon={emptyIcon}
                        title={emptyMessage}
                        description={`Try adjusting your filters or check back later.`}
                      />
                    )}
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-[#E8E8E8] hover:bg-[#FFF]"
                  >
                    <td
                      className="py-4 px-4 font-medium text-[#202020] cursor-pointer"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <div className="flex items-center">
                        {activeTab === "available" ? (
                          <PiDotsSixVertical
                            size={20}
                            className="mr-3 text-green-500"
                          />
                        ) : activeTab === "booked" ? (
                          <PiDotsSixVertical
                            size={20}
                            className="mr-3 text-yellow-500"
                          />
                        ) : (
                          <PiDotsSixVertical
                            size={20}
                            className="mr-3 text-red-500"
                          />
                        )}
                        {room.code}
                      </div>
                    </td>
                    <td
                      className="py-4 px-4"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <img
                        src={room.image || "https://placehold.co/60x60"}
                        alt={room.code}
                        className="h-10 w-10 object-cover rounded-md"
                      />
                    </td>
                    <td
                      className="py-4 px-4 text-[#202020] font-medium"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      ${room.price_per_night.toFixed(2)}
                      <span className="text-xs text-[#838383] ml-1">
                        /night
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-[#202020]"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      {room.max_occupancy}{" "}
                      <span className="text-xs text-[#838383]">guests</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-[1px] ${
                          room.availability_status === "Available"
                            ? "bg-[#D1FAE5] text-[#059669] border-[#a8f6cf]"
                            : room.availability_status === "Booked"
                            ? "bg-[#FEF9C3] text-[#F59E0B] border-[#f6d9a6]"
                            : "bg-[#FEE2E2] text-[#C72A2F] border-[#febebe]"
                        }`}
                      >
                        {room.availability_status}
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-[#202020]"
                      onClick={() => handleRoomClick(room.id)}
                    >
                      <div className="flex items-center">
                        {typeof room.average_rating === "number" &&
                        !isNaN(room.average_rating) ? (
                          <>
                            <span className="font-medium text-amber-600">
                              {room.average_rating.toFixed(1)}
                            </span>
                            <FaStar className="ml-1 text-amber-400" size={12} />
                            <span className="text-xs text-[#838383] ml-1">
                              ({room.review_count || 0})
                            </span>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="hover:text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium text-[0.875rem]  transition-colors border-[#D9DAFF] border-[1px] bg-[#E5E6FF] text-[#5A43D6]"
                          onClick={(event) => handleEditClick(room.id, event)}
                          title="Edit Room"
                        >
                          Edit
                        </button>
                        <button
                          className="hover:text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium text-[0.875rem] bg-[#ffd6d7] text-[#C72A2F] border-[1px] border-[#fec6c8] transition-colors"
                          onClick={(event) => handleDeleteClick(room.id, event)}
                          disabled={
                            deleteRoomMutation.isLoading &&
                            deleteRoomMutation.variables === room.id
                          }
                          title="Delete Room"
                        >
                          {deleteRoomMutation.isLoading &&
                          deleteRoomMutation.variables === room.id ? (
                            <FaSpinner className="animate-spin h-4 w-4" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination is only shown if there are rooms AND if totalCount is more than one page's worth */}
        {totalCount > ITEMS_PER_PAGE && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </>
    );
  };

  const filteredRooms = useMemo(() => {
    let currentRooms: Room[] = [];
    switch (activeTab) {
      case "available":
        currentRooms = availableRoomsResponse?.results || [];
        break;
      case "booked":
        currentRooms = bookedRoomsResponse?.results || [];
        break;
      case "maintenance":
        currentRooms = maintenanceRoomsResponse?.results || [];
        break;
    }
    // No client-side filtering needed here as API handles search, occupancy.
    return currentRooms;
  }, [
    activeTab,
    availableRoomsResponse,
    bookedRoomsResponse,
    maintenanceRoomsResponse,
  ]);

  return (
    <div className="w-full min-h-full pb-[1rem]">
      {/* Section Header */}
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-2.5 ">
            <button>
              <IoChevronBackOutline color="#646464" size={18} />
            </button>
            <button>
              <IoChevronForwardOutline color="#646464" size={18} />
            </button>
          </div>
          <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
            Room Management
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
          <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
          Manage all rooms, availability, and details within your hotel.
        </p>
      </div>

      {/* --- Tab Navigation & Add New Room Button --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-4">
        {/* Tab Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-[1.5rem] py-[8px] rounded-full font-medium transition-all duration-200 flex items-center gap-4 ${
              activeTab === "available" ? " text-[#04966A]" : "  text-[#04966A]"
            }`}
          >
            <FaBed className="flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Available</div>
              <div className="text-xs opacity-80">
                {availableRoomsResponse?.count || 0} rooms
              </div>
            </div>
          </button>
          <div className="bg-[#E8E8E8] h-[35px] w-[2px] rounded-full"></div>
          <button
            onClick={() => setActiveTab("booked")}
            className={`px-[1.5rem] py-[8px] rounded-full font-medium transition-all duration-200 flex items-center gap-4  text-[#F59E0B] cursor-pointer ${
              activeTab === "booked" ? "text-[#F59E0B]" : " text-[#6B7280]"
            }`}
          >
            <FaCalendarTimes className="flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Booked</div>
              <div className="text-xs opacity-80">
                {bookedRoomsResponse?.count || 0} rooms
              </div>
            </div>
          </button>
          <div className="bg-[#E8E8E8] h-[35px] w-[2px] rounded-full"></div>

          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-[1.5rem] py-[8px] rounded-full font-medium transition-all duration-200 flex items-center gap-4 text-[#EF4444] cursor-pointer ${
              activeTab === "maintenance" ? "text-[#EF4444]" : "text-[#6B7280]"
            }`}
          >
            <FaTools className="flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">Maintenance</div>
              <div className="text-xs opacity-80">
                {maintenanceRoomsResponse?.count || 0} rooms
              </div>
            </div>
          </button>
        </div>

        {/* Add New Room Button */}
        <button
          onClick={() => navigate("/rooms/add-room")}
          className="px-6 py-2 rounded-full flex items-center transition-colors duration-300 flex-shrink-0 mt-4 sm:mt-0 border-[#ced0fd] border-[1px] bg-[#E5E6FF] text-[#5A43D6] text-[0.875rem] font-medium"
        >
          <IoAddOutline size={21} className="mr-1" />
          Add New Room
        </button>
      </div>

      {/* --- FILTERS --- */}
      <div className="mb-6">
        <div className="relative w-full px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search rooms..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full py-[7px] pl-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange("search", "")}
              className="absolute inset-y-0 right-0 pr-8 flex items-center text-[#6B7280] hover:text-[#334155]"
              title="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 px-4 flex flex-wrap items-center gap-2.5">
        <h2 className="text-xl font-semibold text-[#334155]">Filter Rooms</h2>
        {/* Max Occupancy Filter */}
        <select
          value={filters.maxOccupancy}
          onChange={(e) => handleFilterChange("maxOccupancy", e.target.value)}
          className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
        >
          <option value="">All Occupancies</option>
          {uniqueMaxOccupancies.map((occupancy) => (
            <option key={occupancy} value={occupancy}>
              {occupancy} guests
            </option>
          ))}
        </select>

        {/* Removed Price Sort Filter */}
        {/*
        <select
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
          className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
        >
          <option value="">Sort by Price</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        */}

        {(filters.search || filters.maxOccupancy) && ( // Updated condition (removed sortOrder)
          <button
            onClick={clearFilters}
            className="px-[0.9375rem] py-[0.5rem] border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium flex items-center gap-1.5 transition-all hover:bg-gray-50"
          >
            <FaTimes className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </div>

      {/* --- CONDITIONAL TABLE RENDERING --- */}
      <div className="px-4">
        {activeTab === "available" &&
          renderTable(
            availableRoomsResponse?.results || [],
            isLoadingAvailable,
            isErrorAvailable,
            errorAvailable,
            availableRoomsResponse?.count || 0,
            availableCurrentPage,
            setAvailableCurrentPage,
            "No Available Rooms Found",
            FaBed
          )}
        {activeTab === "booked" &&
          renderTable(
            bookedRoomsResponse?.results || [],
            isLoadingBooked,
            isErrorBooked,
            errorBooked,
            bookedRoomsResponse?.count || 0,
            bookedCurrentPage,
            setBookedCurrentPage,
            "No Booked Rooms Found",
            FaCalendarTimes
          )}
        {activeTab === "maintenance" &&
          renderTable(
            maintenanceRoomsResponse?.results || [],
            isLoadingMaintenance,
            isErrorMaintenance,
            errorMaintenance,
            maintenanceRoomsResponse?.count || 0,
            maintenanceCurrentPage,
            setMaintenanceCurrentPage,
            "No Rooms Under Maintenance",
            FaTools
          )}
      </div>
    </div>
  );
}
