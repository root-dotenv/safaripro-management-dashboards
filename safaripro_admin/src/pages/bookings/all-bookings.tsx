// - - - safaripro_admin/src/pages/bookings/all-bookings.tsx
import { useQuery } from "@tanstack/react-query";
import bookingClient from "../../api/booking-client";
import type { Booking } from "./booking-types";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

export default function AllBookings() {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // - - - Get all bookings (query function)
  const {
    data: bookings,
    error,
    isLoading,
    isError,
  } = useQuery<Booking[]>({
    queryKey: ["bookings", limit, offset],
    queryFn: async () => {
      const response = await bookingClient.get(
        `v1/bookings?limit=${limit}&offset=${offset}`
      );
      return response.data.results;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(`- - - Debugging bookings page`);
  console.log(bookings);

  //  - - -  Show Booking Details Modal fn
  const showBookingDetailsModal = (bookingId: string) => {
    console.log(`Show details for booking ID: ${bookingId}`);
  };

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));
  };

  return (
    <div className="p-6 text-[0.875rem]">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#E5E6FF]">
          <tr>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              S/N
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Booking ID
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Hotel Name
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Room Type
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              CHECKS (Check-in/Check-out)
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              AMOUNT (Amount Paid/Amount Required)
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              STATUS (Booking Status)
            </th>

            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              GUEST DETAILS
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              PAYMENT METHOD
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              BOOKING SOURCE
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              STATUS
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings?.map((booking, index) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                {offset + index + 1}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {booking.code}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {booking.microservice_item_name}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {booking.property_item_type}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {booking.start_date} / {booking.end_date}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                Paid: {booking.amount_paid} / Required:{" "}
                {booking.amount_required}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.booking_status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : booking.booking_status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.booking_status}
                </span>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                <div>{booking.full_name}</div>
                <div>{booking.email}</div>
                <div>{booking.address}</div>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                <div>{booking.payment_method}</div>
                <div>{booking.payment_reference}</div>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {booking.booking_source}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                <div>Booking: {booking.booking_status}</div>
                <div>Payment: {booking.payment_status}</div>
                <div>Cancellation: {booking.cancellation_policy}</div>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-center text-sm text-[#202020]">
                <button
                  onClick={() => showBookingDetailsModal(booking.id)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* - - - Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={offset === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          disabled={(bookings ?? []).length < limit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
