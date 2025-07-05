import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaSpinner,
  FaCalendarCheck,
  FaUser,
  FaHotel,
  FaDoorOpen,
  FaInfoCircle,
} from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi"; // For error icon
import React from "react"; // Explicitly import React

// Define the RoomDetails type as per your special-requests.tsx
interface RoomDetails {
  id: string;
  code: string; // Room code
  room_type_name: string; // Room type name
}

// Define the Booking type based on your sample response, focusing on relevant fields
interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone_number: number;
  property_id: string; // Used to fetch room details
  property_item_type: string; // Room type from booking itself
  checkin: string | null; // The key field to check for checked-in status
  checkout: string | null;
  code: string; // Booking ID/Code
  microservice_item_name: string; // Hotel Name
}

interface BookingsResponse {
  count: number;
  results: Booking[];
}

// Reusable No Data / Error Message Component (copied from all-rooms.tsx and guests.tsx)
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

export default function CheckedIn() {
  // Fetch all bookings for the specific microservice_item_id
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery<BookingsResponse>({
    queryKey: ["allBookingsForCheckedIn"], // Unique key to avoid conflicts
    queryFn: async () => {
      // Use the specific microservice_item_id from your existing components
      const response = await axios.get(
        "https://booking.tradesync.software/api/v1/bookings?microservice_item_id=96e3bfc0-48bd-40f7-a6a8-3c86f11899b6"
      );
      return response.data;
    },
    refetchOnWindowFocus: false, // Prevents refetching on window focus
  });

  // Filter bookings to get only those that are checked in
  const checkedInBookings = React.useMemo(() => {
    return (
      bookingsData?.results.filter(
        (booking) => booking.checkin !== null && booking.checkin !== ""
      ) || []
    );
  }, [bookingsData]);

  // Fetch room details for each checked-in booking
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useQuery<Record<string, RoomDetails>>({
    queryKey: [
      "roomsForCheckedIn",
      checkedInBookings.map((b) => b.property_id).join(","),
    ], // Key includes property IDs for refetching if bookings change
    queryFn: async () => {
      if (checkedInBookings.length === 0) return {};

      // Get unique property_ids to avoid duplicate API calls
      const uniquePropertyIds = Array.from(
        new Set(checkedInBookings.map((booking) => booking.property_id))
      );

      const roomPromises = uniquePropertyIds.map((propertyId) =>
        axios
          .get(`https://hotel.tradesync.software/api/v1/rooms/${propertyId}/`)
          .then((response) => [propertyId, response.data])
          .catch((error) => {
            console.error(
              `Failed to fetch room details for property ID ${propertyId}:`,
              error
            );
            return [propertyId, null]; // Return null for failed fetches
          })
      );

      const roomResults = await Promise.all(roomPromises);
      return Object.fromEntries(
        roomResults.filter(([, data]) => data !== null)
      ); // Filter out null results
    },
    enabled: checkedInBookings.length > 0, // Only run the query if there are checked-in bookings
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache room data for 5 minutes
  });

  if (isLoadingBookings || isLoadingRooms) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <FaSpinner className="animate-spin text-4xl text-[#553ED0]" />
      </div>
    );
  }

  if (bookingsError || roomsError) {
    return (
      <NoDataMessage
        icon={FiAlertTriangle}
        title="Error Loading Checked-In Guests!"
        description={
          bookingsError?.message ||
          roomsError?.message ||
          "An unknown error occurred while fetching data."
        }
        type="error"
      />
    );
  }

  if (checkedInBookings.length === 0) {
    return (
      <NoDataMessage
        icon={FaCalendarCheck}
        title="No Guests Checked In"
        description="There are currently no guests with a defined check-in date."
        type="info"
      />
    );
  }

  return (
    <div className="w-full h-full min-h-screen pb-[1rem] px-4 py-6">
      <div className="flex items-center gap-x-4 mb-6">
        <h1 className="text-[1.375rem] text-[#202020] font-bold">
          Checked-In Guests Overview
        </h1>
      </div>

      <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center mb-6">
        <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
        View all guests who have successfully checked into your hotel.
      </p>

      <div className="bg-white rounded-xl shadow-lg border border-[#E7EBF5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8E8E8]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Hotel Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Guest Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Room Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Check-in Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#838383] uppercase tracking-wider">
                  Check-out Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8E8E8]">
              {checkedInBookings.map((booking) => {
                const room = roomsData?.[booking.property_id];
                return (
                  <tr key={booking.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#202020]">
                        {booking.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaHotel className="mr-2 text-[#059669]" />
                        <span className="text-sm text-[#202020]">
                          {booking.microservice_item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="mr-2 text-[#553ED0]" />
                        <span className="text-sm font-medium text-[#202020]">
                          {booking.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#202020]">
                        <p>{booking.email}</p>
                        <p className="text-[#838383]">{booking.phone_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#202020]">
                        <p>
                          Room Code:{" "}
                          <span className="font-medium">
                            {room?.code || "N/A"}
                          </span>
                        </p>
                        <p className="text-[#838383] flex items-center">
                          Type:{" "}
                          <FaDoorOpen className="ml-1 mr-1 text-[#F59E0B]" />
                          {booking.property_item_type}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202020]">
                      {booking.checkin
                        ? new Date(booking.checkin).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#202020]">
                      {booking.checkout
                        ? new Date(booking.checkout).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
