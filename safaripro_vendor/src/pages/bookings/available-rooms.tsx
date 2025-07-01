// - - - safaripro_admin/src/pages/bookings/available-rooms.tsx
import { useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import type { Hotel } from "../../types/hotel-types"; // Import Hotel interface
import type { RoomType } from "../../types/room-types"; // Import RoomType interface
import { useState } from "react"; // Import useState for pagination
import CustomLoader from "../../components/ui/custom-loader";
import { FaEye } from "react-icons/fa";

// Define the Room interface based on the structure returned from the rooms endpoint
interface Room {
  id: string;
  code: string;
  description: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  hotel: string;
  room_type: string;
  image: string;
}

// Interface for the paginated response structure
interface PaginatedRoomsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Room[];
}

export default function AvailableRooms() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of items per page

  // 1. First Query: Fetch all rooms with pagination
  const {
    data: roomsResponse, // Renamed to roomsResponse to hold the full pagination object
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
    error: roomsError,
  } = useQuery<PaginatedRoomsResponse>({
    queryKey: ["rooms", page, limit], // Include page and limit in queryKey
    queryFn: async () => {
      // Use the 'page' parameter for pagination
      const response = await hotelClient.get(`v1/rooms/?page=${page}`);
      return response.data; // Return the entire response object including count, next, previous
    },
    refetchOnWindowFocus: false,
  });

  const rooms = roomsResponse?.results; // Extract the actual room data
  const hasNextPage = roomsResponse?.next !== null;
  const hasPreviousPage = roomsResponse?.previous !== null;

  // Extract unique hotel and room type IDs from the fetched rooms
  const uniqueHotelIds = Array.from(new Set(rooms?.map((room) => room.hotel)));
  const uniqueRoomTypeIds = Array.from(
    new Set(rooms?.map((room) => room.room_type))
  );

  // 2. Second Query (Dependent): Fetch hotel details based on uniqueHotelIds
  const {
    data: hotelsData,
    isLoading: isLoadingHotels,
    isError: isErrorHotels,
    error: hotelsError,
  } = useQuery<Hotel[]>({
    queryKey: ["hotels", uniqueHotelIds],
    queryFn: async () => {
      // Fetch details for each unique hotel ID in parallel
      const hotelPromises = uniqueHotelIds.map((id) =>
        hotelClient.get(`v1/hotels/${id}/`).then((res) => res.data)
      );
      return Promise.all(hotelPromises);
    },
    // Only enable this query if rooms are loaded and there are unique hotel IDs
    enabled: !!rooms && uniqueHotelIds.length > 0,
    refetchOnWindowFocus: false,
  });

  // Create a map for quick lookup of hotel names by ID
  const hotelNamesMap = new Map<string, string>();
  hotelsData?.forEach((hotel) => {
    hotelNamesMap.set(hotel.id, hotel.name);
  });

  // 3. Third Query (Dependent): Fetch room type details based on uniqueRoomTypeIds
  const {
    data: roomTypesData,
    isLoading: isLoadingRoomTypes,
    isError: isErrorRoomTypes,
    error: roomTypesError,
  } = useQuery<RoomType[]>({
    queryKey: ["roomTypes", uniqueRoomTypeIds],
    queryFn: async () => {
      // Fetch details for each unique room type ID in parallel
      const roomTypePromises = uniqueRoomTypeIds.map((id) =>
        hotelClient.get(`v1/room-types/${id}/`).then((res) => res.data)
      );
      return Promise.all(roomTypePromises);
    },
    // Only enable this query if rooms are loaded and there are unique room type IDs
    enabled: !!rooms && uniqueRoomTypeIds.length > 0,
    refetchOnWindowFocus: false,
  });

  // Create a map for quick lookup of room type names by ID
  const roomTypeNamesMap = new Map<string, string>();
  roomTypesData?.forEach((roomType) => {
    roomTypeNamesMap.set(roomType.id, roomType.name);
  });

  // Handle Loading States
  if (isLoadingRooms || isLoadingHotels || isLoadingRoomTypes) {
    return <CustomLoader />;
  }

  // Handle Error States
  if (isErrorRooms) {
    return <div>Error loading rooms: {roomsError?.message}</div>;
  }
  if (isErrorHotels) {
    return <div>Error loading hotel details: {hotelsError?.message}</div>;
  }
  if (isErrorRoomTypes) {
    return (
      <div>Error loading room type details: {roomTypesError?.message}</div>
    );
  }

  console.log(`- - - Debugging available rooms page`);
  console.log("Rooms Response:", roomsResponse); // Log the full response
  console.log("Rooms Data:", rooms);
  console.log("Hotels Data:", hotelsData);
  console.log("Room Types Data:", roomTypesData);

  // Pagination Handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setPage((prevPage) => Math.max(1, prevPage - 1)); // Ensure page doesn't go below 1
    }
  };

  return (
    <div className="p-6 text-[0.875rem]">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#E5E6FF]">
          <tr>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Room Code
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Capacity
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Hotel
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Room Type
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms?.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {room.code}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {room.description}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {room.max_occupancy}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                ${room.price_per_night}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.availability_status === "Booked"
                      ? "bg-red-100 text-red-800"
                      : room.availability_status === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {room.availability_status}
                </span>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {hotelNamesMap.get(room.hotel) || "N/A"}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomTypeNamesMap.get(room.room_type) || "N/A"}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[#202020]">
                <button
                  onClick={() =>
                    console.log(`View details for room ${room.id}`)
                  }
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
