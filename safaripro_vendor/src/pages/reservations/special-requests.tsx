import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

interface RoomDetails {
  id: string;
  code: string;
  room_type_name: string;
}

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone_number: number;
  property_id: string;
  special_requests: string;
  property_item_type: string;
}

interface BookingsResponse {
  count: number;
  results: Booking[];
}

export default function SpecialRequests() {
  // Fetch all bookings
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery<BookingsResponse>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get(
        "https://booking.tradesync.software/api/v1/bookings"
      );
      return response.data;
    },
  });

  // Fetch room details for each booking
  const {
    data: roomsData,
    isLoading: isLoadingRooms,
    error: roomsError,
  } = useQuery<Record<string, RoomDetails>>({
    queryKey: ["rooms", bookingsData?.results],
    queryFn: async () => {
      if (!bookingsData?.results) return {};

      const roomPromises = bookingsData.results.map((booking) =>
        axios
          .get(
            `https://hotel.tradesync.software/api/v1/rooms/${booking.property_id}/`
          )
          .then((response) => [booking.property_id, response.data])
          .catch(() => [booking.property_id, null])
      );

      const roomResults = await Promise.all(roomPromises);
      return Object.fromEntries(roomResults);
    },
    enabled: !!bookingsData?.results,
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
      <div className="p-4 bg-[#FEF2F2] text-[#C72A2F] rounded-md mx-auto max-w-6xl mt-8">
        Error loading data. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#202020] mb-6">
          Special Requests
        </h1>

        <div className="bg-white rounded-xl shadow-lg border border-[#E7EBF5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E8E8]">
              <thead className="bg-[#F8FAFC]">
                <tr>
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
                    Special Requests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E8E8]">
                {bookingsData?.results.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#202020]">
                        {booking.full_name}
                      </span>
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
                          Room:{" "}
                          {roomsData?.[booking.property_id]?.code || "N/A"}
                        </p>
                        <p className="text-[#838383]">
                          Type: {booking.property_item_type}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#202020]">
                        {booking.special_requests || "No special requests"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
