// safaripro_vendor/src/pages/bookings/create-booking-form.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"; // Import useQuery
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner, FaArrowLeft, FaBed, FaUsers, FaStar } from "react-icons/fa"; // Added FaBed, FaUsers, FaStar

// --- TYPE DEFINITIONS ---
// Define the shape of the data that will be sent in the POST request payload.
interface NewBookingFormData {
  full_name: string;
  phone_number: string;
  property_item_type: string; // Now pre-filled from room details
  property_item: string; // Hardcoded
  property_id: string; // Now pre-filled from room ID
  start_date: string;
  end_date: string;
  checkin: null;
  checkout: null;
  address: string;
  email: string;
  booking_type: string; // Hardcoded to "Physical"
  amount_required: string; // Now pre-filled from room details
  microservice_item_id: string; // Hardcoded
  special_requests: string;
  booking_status: string;
  number_of_booked_property: number;
  number_of_guests: number;
  number_of_children: number;
  number_of_infants: number;
  amount_paid: string;
}

// Interface for fetched Room Details
interface RoomDetails {
  id: string;
  hotel_name: string;
  hotel_id: string;
  room_type_name: string;
  room_type_id: string;
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  average_rating: string; // Keep as string as per sample, will parse for display
  review_count: number;
}

// Reusable No Data / Error Message Component (for consistency, though less likely to be used here)
const NoDataMessage: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  type?: "info" | "error";
  children?: React.ReactNode;
}> = ({ icon: Icon, title, description, type = "info", children }) => (
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
    {children}
  </div>
);

export default function CreateBookingForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>(); // Get room ID from URL

  // --- FETCH ROOM DETAILS ---
  const {
    data: roomDetails,
    isLoading: isLoadingRoomDetails,
    isError: isErrorRoomDetails,
    error: roomDetailsError,
  } = useQuery<RoomDetails>({
    queryKey: ["roomDetails", roomId],
    queryFn: async () => {
      if (!roomId) {
        throw new Error("Room ID is missing.");
      }
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/rooms/${roomId}/`
      );
      return response.data;
    },
    enabled: !!roomId, // Only fetch if roomId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize formData with all fields.
  // Default hardcoded values and values that will be pre-filled from roomDetails.
  const [formData, setFormData] = useState<NewBookingFormData>({
    full_name: "",
    phone_number: "",
    property_item_type: "", // Will be set from roomDetails.room_type_name
    property_item: "2cab4f9b-60e4-4d00-bc3c-1a4d45689dea", // Hardcoded
    property_id: "", // Will be set from roomDetails.id
    start_date: "",
    end_date: "",
    checkin: null,
    checkout: null,
    address: "",
    email: "",
    booking_type: "Physical", // Hardcoded
    amount_required: "", // Will be set from roomDetails.price_per_night
    microservice_item_id: "96e3bfc0-48bd-40f7-a6a8-3c86f11899b6", // Hardcoded
    special_requests: "",
    booking_status: "",
    number_of_booked_property: 1,
    number_of_guests: 1,
    number_of_children: 0,
    number_of_infants: 0,
    amount_paid: "",
  });
  const [submissionConfirmed, setSubmissionConfirmed] = useState(false);

  // Effect to update formData when roomDetails are fetched
  useEffect(() => {
    if (roomDetails) {
      setFormData((prev) => ({
        ...prev,
        property_id: roomDetails.id,
        property_item_type: roomDetails.room_type_name,
        amount_required: roomDetails.price_per_night.toFixed(2), // Format to 2 decimal places as string
      }));
    }
  }, [roomDetails]);

  // --- CREATE BOOKING MUTATION ---
  const createBookingMutation = useMutation<any, Error, NewBookingFormData>({
    mutationFn: async (newBooking) => {
      const response = await axios.post(
        "https://booking.tradesync.software/api/v1/bookings/web-create",
        newBooking
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created successfully!");
      navigate("/bookings/all-bookings");
    },
    onError: (error) => {
      console.error("Failed to create booking:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.detail
          ? error.response.data.detail
          : "An unknown error occurred.";
      toast.error(`Failed to create booking: ${errorMessage}`);
    },
  });

  // --- HANDLERS ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionConfirmed) {
      toast.info(
        "Please confirm your booking details below by checking the box."
      );
      return;
    }

    // List of required fields for basic validation
    // property_id, property_item_type, amount_required are now pre-filled
    const requiredFields: Array<keyof NewBookingFormData> = [
      "full_name",
      "phone_number",
      "start_date",
      "end_date",
      "address",
      "email",
      "booking_status",
      "number_of_booked_property",
      "number_of_guests",
      "amount_paid",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        (typeof formData[field] === "string" &&
          formData[field].trim() === "") ||
        (typeof formData[field] === "number" &&
          isNaN(formData[field] as number)) ||
        formData[field] === null
    );

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Ensure pre-filled fields are not empty before sending
    if (
      !formData.property_id ||
      !formData.property_item_type ||
      !formData.amount_required
    ) {
      toast.error("Room details are still loading or missing. Please wait.");
      return;
    }

    const bookingDataToSend: NewBookingFormData = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      property_item_type: formData.property_item_type, // Pre-filled
      property_item: formData.property_item, // Hardcoded
      property_id: formData.property_id, // Pre-filled
      start_date: formData.start_date,
      end_date: formData.end_date,
      checkin: null,
      checkout: null,
      address: formData.address,
      email: formData.email,
      booking_type: formData.booking_type, // Hardcoded
      amount_required: formData.amount_required, // Pre-filled
      microservice_item_id: formData.microservice_item_id, // Hardcoded
      special_requests: formData.special_requests,
      booking_status: formData.booking_status,
      number_of_booked_property: formData.number_of_booked_property,
      number_of_guests: formData.number_of_guests,
      number_of_children: formData.number_of_children,
      number_of_infants: formData.number_of_infants,
      amount_paid: formData.amount_paid,
    };

    console.log("Final payload being sent:", bookingDataToSend);

    createBookingMutation.mutate(bookingDataToSend);
  };

  const handleToggleConfirmation = () => {
    setSubmissionConfirmed(!submissionConfirmed);
  };

  // --- RENDER LOGIC FOR ROOM DETAILS ---
  if (isLoadingRoomDetails) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans flex items-center justify-center">
        <FaSpinner className="animate-spin text-[#553ED0] text-4xl" />
        <p className="ml-4 text-lg">Loading room details...</p>
      </div>
    );
  }

  if (isErrorRoomDetails || !roomDetails) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans flex items-center justify-center">
        <NoDataMessage
          icon={FaBed}
          title="Room Details Not Found"
          description={
            roomDetailsError?.message ||
            "Could not load details for the selected room. Please try again."
          }
          type="error"
        >
          <button
            onClick={() => navigate("/bookings/available-rooms")}
            className="mt-4 px-4 py-2 border border-[#E8E8E8] text-[#6B7280] rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            Go back to Available Rooms
          </button>
        </NoDataMessage>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-[#E7EBF5]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#202020]">
            Create New Booking
          </h1>
          <button
            onClick={() => navigate("/bookings/all-bookings")}
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E8E8] text-[#6B7280] rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            <FaArrowLeft /> Back to All Bookings
          </button>
        </div>

        {/* Display Fetched Room Details */}
        <div className="mb-6 p-4 border border-[#D9DAFF] rounded-lg bg-[#E5E6FF] flex flex-col md:flex-row items-center gap-4">
          <img
            src={roomDetails.image || "https://placehold.co/100x100?text=Room"}
            alt={roomDetails.code}
            className="w-24 h-24 object-cover rounded-md border border-[#553ED0]"
          />
          <div className="flex-1 text-[#202020]">
            <h3 className="text-xl font-bold mb-1">
              {roomDetails.room_type_name} - Room {roomDetails.code}
            </h3>
            <p className="text-sm text-[#334155] mb-2">
              {roomDetails.description}
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1">
                <FaUsers className="text-[#553ED0]" /> Max Occupancy:{" "}
                {roomDetails.max_occupancy}
              </span>
              <span className="flex items-center gap-1">
                <FaBed className="text-[#553ED0]" /> Price/Night: $
                {roomDetails.price_per_night.toFixed(2)}
              </span>
              <span className="flex items-center gap-1">
                <FaStar className="text-amber-400" /> Rating:{" "}
                {parseFloat(roomDetails.average_rating).toFixed(1)} (
                {roomDetails.review_count} reviews)
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Information */}
          <div className="border-b border-[#E8E8E8] pb-4">
            <h2 className="text-xl font-semibold text-[#334155] mb-4">
              Guest Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="border-b border-[#E8E8E8] pb-4 pt-4">
            <h2 className="text-xl font-semibold text-[#334155] mb-4">
              Booking Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              {/* property_item_type is now pre-filled and read-only */}
              <div>
                <label
                  htmlFor="property_item_type"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Property Item Type
                </label>
                <input
                  type="text"
                  id="property_item_type"
                  name="property_item_type"
                  value={formData.property_item_type}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md bg-gray-100 text-[#202020] cursor-not-allowed"
                  readOnly
                />
              </div>
              {/* property_id is now pre-filled and read-only */}
              <div>
                <label
                  htmlFor="property_id"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Property ID
                </label>
                <input
                  type="text"
                  id="property_id"
                  name="property_id"
                  value={formData.property_id}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md bg-gray-100 text-[#202020] cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Booking Type is hardcoded, so its select input is removed */}
              <div>
                <label
                  htmlFor="booking_status"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Booking Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="booking_status"
                  name="booking_status"
                  value={formData.booking_status}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                  <option value="Refunded">Refunded</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Reserved">Reserved</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="number_of_booked_property"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Number of Booked Property{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="number_of_booked_property"
                  name="number_of_booked_property"
                  value={formData.number_of_booked_property}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  min="1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="number_of_guests"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="number_of_guests"
                  name="number_of_guests"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  min="1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="number_of_children"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Number of Children
                </label>
                <input
                  type="number"
                  id="number_of_children"
                  name="number_of_children"
                  value={formData.number_of_children}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="number_of_infants"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Number of Infants
                </label>
                <input
                  type="number"
                  id="number_of_infants"
                  name="number_of_infants"
                  value={formData.number_of_infants}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  min="0"
                />
              </div>
              {/* amount_required is now pre-filled and read-only */}
              <div>
                <label
                  htmlFor="amount_required"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Amount Required
                </label>
                <input
                  type="text"
                  id="amount_required"
                  name="amount_required"
                  value={formData.amount_required}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md bg-gray-100 text-[#202020] cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="amount_paid"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Amount Paid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" // Keep as text to match sample payload string format
                  id="amount_paid"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  placeholder="e.g., 150.00"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="special_requests"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Special Requests
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  placeholder="Any special requests for the booking..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Confirmation and Submit */}
          <div className="pt-6 border-t border-[#E8E8E8] mt-6">
            <h2 className="text-xl font-semibold text-[#334155] mb-4">
              Confirm Booking
            </h2>
            <div className="bg-[#F8FAFC] p-4 rounded-md border border-[#E7EBF5] text-sm text-[#202020] space-y-2">
              <p className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirm_booking"
                  checked={submissionConfirmed}
                  onChange={handleToggleConfirmation}
                  className="form-checkbox text-[#553ED0] rounded focus:ring-[#553ED0]"
                />
                <label
                  htmlFor="confirm_booking"
                  className="font-medium text-[#202020]"
                >
                  I confirm the booking details are correct.
                </label>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                submissionConfirmed
                  ? "bg-[#553ED0] text-white hover:bg-[#432DBA] shadow-md"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={createBookingMutation.isPending || !submissionConfirmed}
            >
              {createBookingMutation.isPending && (
                <FaSpinner className="animate-spin" />
              )}
              {createBookingMutation.isPending
                ? "Submitting..."
                : "Confirm & Book"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
