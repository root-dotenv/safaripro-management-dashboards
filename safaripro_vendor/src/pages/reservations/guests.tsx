import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner, FaUser } from "react-icons/fa";

interface BookingDetails {
  id: string;
  full_name: string;
  code: string;
  email: string;
  phone_number: number;
  address: string;
  start_date: string;
  end_date: string;
  booking_status: string;
  payment_status: string;
  amount_paid: string;
  amount_required: string;
  number_of_guests: number;
  number_of_children: number;
  number_of_infants: number;
  special_requests: string;
  property_details: {
    name: string;
    category: string;
  };
}

export default function Guest() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery<BookingDetails>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const response = await axios.get(
        `https://booking.tradesync.software/api/v1/bookings/${bookingId}`
      );
      return response.data;
    },
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <FaSpinner className="animate-spin text-4xl text-[#553ED0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#FEF2F2] text-[#C72A2F] rounded-md mx-auto max-w-4xl mt-8">
        Error loading booking details. Please try again.
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-4 bg-[#E0F2FE] text-[#2196F3] rounded-md mx-auto max-w-4xl mt-8">
        No booking details found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#E5E6FF] p-3 rounded-full">
              <FaUser className="text-[#553ED0] text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#202020]">
                Guest Details
              </h1>
              <p className="text-[#838383] text-sm">
                Booking Reference: {booking.code}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-[#E7EBF5] p-8">
          {/* Status Badges */}
          <div className="flex gap-4 mb-6">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                booking.booking_status === "Confirmed"
                  ? "bg-[#D1FAE5] text-[#059669]"
                  : "bg-[#FEF9C3] text-[#F59E0B]"
              }`}
            >
              {booking.booking_status}
            </span>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                booking.payment_status === "Paid"
                  ? "bg-[#D1FAE5] text-[#059669]"
                  : "bg-[#FEF9C3] text-[#F59E0B]"
              }`}
            >
              {booking.payment_status}
            </span>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <section className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E8E8E8]">
                <h2 className="text-lg font-semibold text-[#334155] mb-4">
                  Guest Information
                </h2>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Name:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.full_name}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Email:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.email}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Phone:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.phone_number}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Address:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.address}
                    </span>
                  </p>
                </div>
              </section>

              <section className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E8E8E8]">
                <h2 className="text-lg font-semibold text-[#334155] mb-4">
                  Stay Details
                </h2>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Property:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.property_details.name}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Check-in:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.start_date}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Check-out:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.end_date}
                    </span>
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <section className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E8E8E8]">
                <h2 className="text-lg font-semibold text-[#334155] mb-4">
                  Guest Count
                </h2>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Adults:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.number_of_guests}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Children:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.number_of_children}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Infants:</span>
                    <span className="font-medium text-[#202020]">
                      {booking.number_of_infants}
                    </span>
                  </p>
                </div>
              </section>

              <section className="bg-[#F8FAFC] p-6 rounded-lg border border-[#E8E8E8]">
                <h2 className="text-lg font-semibold text-[#334155] mb-4">
                  Payment Details
                </h2>
                <div className="space-y-3">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Amount Required:</span>
                    <span className="font-medium text-[#202020]">
                      ${booking.amount_required}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#838383]">Amount Paid:</span>
                    <span className="font-medium text-[#202020]">
                      ${booking.amount_paid}
                    </span>
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <section className="mt-6 bg-[#F8FAFC] p-6 rounded-lg border border-[#E8E8E8]">
              <h2 className="text-lg font-semibold text-[#334155] mb-4">
                Special Requests
              </h2>
              <p className="text-sm text-[#202020]">
                {booking.special_requests}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
