// all-rooms.tsx
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import axios, { AxiosError } from "axios";
import { Pagination } from "../../components/ui/pagination";
import { RoomDetailModal } from "../../components/ui/room-details-modal";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaTools,
  FaCalendarTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaListOl,
  FaImage,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaStar,
  FaPlus,
  FaInfoCircle,
  FaHotel,
  FaDoorOpen,
  FaDoorClosed,
  FaCogs,
} from "react-icons/fa";
import { toast } from "sonner";
import { FiAlertTriangle } from "react-icons/fi";

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

const ITEMS_PER_PAGE = 12;

// --- Reusable No Data / Error Message Component ---
const NoDataMessage: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  type?: "info" | "error";
}> = ({ icon: Icon, title, description, type = "info" }) => (
  <div
    className={`p-8 rounded-xl text-center shadow border ${
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
  const base_URL = import.meta.env.VITE_BASE_URL;
  const hotel_ID = import.meta.env.VITE_HOTEL_ID;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<
    "available" | "booked" | "maintenance"
  >("available");
  const [availableCurrentPage, setAvailableCurrentPage] = useState(1);
  const [bookedCurrentPage, setBookedCurrentPage] = useState(1);
  const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxOccupancy: "",
    search: "",
  });

  // --- Helper to build common query parameters ---
  const getCommonQueryParams = (page: number) => ({
    hotel_id: hotel_ID,
    page: page,
    page_size: ITEMS_PER_PAGE,
    ...(filters.search && { search: filters.search }),
    ...(filters.maxOccupancy && { max_occupancy: filters.maxOccupancy }),
  });

  // --- Generic fetch function for rooms with parsing ---
  const fetchRooms = async (
    availabilityStatus: string,
    page: number
  ): Promise<RoomsResponse> => {
    const params = {
      ...getCommonQueryParams(page),
      availability_status: availabilityStatus,
    };
    const response = await axios.get<RoomsResponse>(`${base_URL}rooms/`, {
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
      filters.search,
    ],
    queryFn: () => fetchRooms("Available", availableCurrentPage),
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
      filters.search,
    ],
    queryFn: () => fetchRooms("Booked", bookedCurrentPage),
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
      filters.search,
    ],
    queryFn: () => fetchRooms("Maintenance", maintenanceCurrentPage),
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
      const delResponse = await axios.delete(
        `https://hotel.tradesync.software/api/v1/rooms/${roomId}/`
      );
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
    filterType: "maxOccupancy" | "search",
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
    });
    setAvailableCurrentPage(1);
    setBookedCurrentPage(1);
    setMaintenanceCurrentPage(1);
  };

  const handleRoomClick = (roomId: string) => setSelectedRoomId(roomId);
  const handleCloseModal = () => setSelectedRoomId(null);

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
    statusColorClass: string,
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaListOl className="mr-2 text-gray-500 dark:text-gray-400" />
                      Room No
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaImage className="mr-2 text-gray-500 dark:text-gray-400" />
                      Image
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaDollarSign className="mr-2 text-gray-500 dark:text-gray-400" />
                      Price
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-gray-500 dark:text-gray-400" />
                      Max Occupancy
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-2 text-gray-500 dark:text-gray-400" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaStar className="mr-2 text-gray-500 dark:text-gray-400" />
                      Rating
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`${statusColorClass} hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150`}
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <div className="flex items-center">
                          {activeTab === "available" ? (
                            <FaDoorOpen className="mr-2 text-green-500" />
                          ) : activeTab === "booked" ? (
                            <FaDoorClosed className="mr-2 text-yellow-500" />
                          ) : (
                            <FaCogs className="mr-2 text-red-500" />
                          )}
                          {room.code}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <img
                          src={
                            room.image ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          alt={room.code}
                          className="h-12 w-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                        />
                      </td>
                      <td
                        className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <div className="flex items-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            ${room.price_per_night.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            /night
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">
                            {room.max_occupancy}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            guests
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            room.availability_status === "Available"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : room.availability_status === "Booked"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {room.availability_status}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                        onClick={() => handleRoomClick(room.id)}
                      >
                        <div className="flex items-center">
                          {typeof room.average_rating === "number" &&
                          !isNaN(room.average_rating) ? (
                            <>
                              <span className="font-medium text-amber-600 dark:text-amber-400">
                                {room.average_rating.toFixed(1)}
                              </span>
                              <FaStar
                                className="ml-1 text-amber-400"
                                size={12}
                              />
                              <span className="text-xs text-gray-500 ml-1">
                                ({room.review_count || 0})
                              </span>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            onClick={(event) => handleEditClick(room.id, event)}
                            title="Edit Room"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            onClick={(event) =>
                              handleDeleteClick(room.id, event)
                            }
                            disabled={deleteRoomMutation.isLoading}
                            title="Delete Room"
                          >
                            {deleteRoomMutation.isLoading &&
                            deleteRoomMutation.variables === room.id ? (
                              <FaSpinner className="animate-spin h-4 w-4" />
                            ) : (
                              <FaTrash className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <NoDataMessage
                        icon={emptyIcon}
                        title={emptyMessage}
                        description={`Try adjusting your filters or check back later.`}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* --- MODAL --- */}
      {selectedRoomId && (
        <RoomDetailModal roomId={selectedRoomId} onClose={handleCloseModal} />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <FaHotel className="mr-3 text-blue-600 dark:text-blue-400" />
            Room Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
            <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
            Manage all rooms, availability, and details
          </p>
        </div>
        <button
          onClick={() => navigate("/rooms/add-room")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center shadow transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          Add New Room
        </button>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-[1.5rem] py-[8px] rounded-md font-medium transition-all duration-200 flex items-center gap-4 ${
            activeTab === "available"
              ? "bg-green-600 text-white shadow"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow"
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
        <button
          onClick={() => setActiveTab("booked")}
          className={`px-[1.5rem] py-[8px] rounded-md font-medium transition-all duration-200 flex items-center gap-4 ${
            activeTab === "booked"
              ? "bg-yellow-600 text-white shadow"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow"
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
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`px-[1.5rem] py-[8px] rounded-md font-medium transition-all duration-200 flex items-center gap-4 ${
            activeTab === "maintenance"
              ? "bg-red-600 text-white shadow"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow"
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

      {/* --- FILTERS --- */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <FaFilter className="mr-2 text-blue-600 dark:text-blue-400" />
            Filter Rooms
          </h2>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center"
          >
            <FaTimes className="mr-1.5" />
            Clear Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Room Code..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange("search", "")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <select
            value={filters.maxOccupancy}
            onChange={(e) => handleFilterChange("maxOccupancy", e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">All Occupancies</option>
            {uniqueMaxOccupancies.map((occupancy) => (
              <option key={occupancy} value={occupancy}>
                {occupancy} guests
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- CONDITIONAL TABLE RENDERING --- */}
      {activeTab === "available" &&
        renderTable(
          availableRoomsResponse?.results || [],
          isLoadingAvailable,
          isErrorAvailable,
          errorAvailable,
          availableRoomsResponse?.count || 0,
          availableCurrentPage,
          setAvailableCurrentPage,
          "bg-white dark:bg-gray-800",
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
          "bg-white dark:bg-gray-800",
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
          "bg-white dark:bg-gray-800",
          "No Rooms Under Maintenance",
          FaTools
        )}
    </div>
  );
}
