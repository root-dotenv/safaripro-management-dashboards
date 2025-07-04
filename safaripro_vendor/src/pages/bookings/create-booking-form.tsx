// safaripro_vendor/src/pages/bookings/create-booking-form.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaSpinner,
  FaArrowLeft,
  FaBed,
  FaDollarSign,
  FaUsers,
  FaStar,
  FaInfoCircle,
  FaWifi,
  FaLock,
  FaDoorOpen,
  FaShower,
  FaDesktop,
} from "react-icons/fa";
import { useHotel } from "../../providers/hotel-provider";
import CustomLoader from "../../components/ui/custom-loader";

// --- TYPE DEFINITIONS ---
interface RoomDetail {
  id: string;
  hotel_name: string;
  hotel_id: string;
  room_type_name: string;
  room_type_id: string;
  amenities: {
    id: string;
    name: string;
    code: string;
    description: string;
    icon: string;
  }[];
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  average_rating: string; // Comes as string, convert to number for display
  review_count: number;
}

interface NewBookingFormData {
  full_name: string;
  phone_number: string;
  amount_required: number; // Ensure this is a number as per payload example
  property_item_type: string;
  property_item: string; // Hardcoded (or should come from roomDetails.id if it's the actual property item being booked)
  property_id: string; // Comes from useParams (roomDetails.hotel_id)
  microservice_item_id: string; // Hardcoded, derived from hotel.id
  start_date: string;
  end_date: string;
  checkin: string;
  checkout: string;
  address?: string;
  email: string;
  booking_type: "Physical" | "Online"; // Hardcoded to "Physical"
  booking_status:
    | "Processing"
    | "Confirmed"
    | "Paid"
    | "Checked In"
    | "Checked Out"
    | "Cancelled"
    | "No Show"
    | "Refunded"
    | "In Progress"
    | "Reserved"
    | "On Hold"; // Hardcoded to "Confirmed"
  special_requests?: string | null; // Can be null
  service_notes?: string | null; // Can be null
  voucher_code?: string | null; // Can be null
  number_of_booked_property?: number; // Should be number
}

// - - - HELPER FUNCTION FOR ICON MAPPING ---
const getAmenityIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case "wifi":
      return <FaWifi />;
    case "lock":
      return <FaLock />;
    case "door-open":
      return <FaDoorOpen />;
    case "shower":
      return <FaShower />;
    case "desktop":
      return <FaDesktop />;
    case "bed":
      return <FaBed />;
    case "bath":
      return <FaShower />; // Reusing shower for bath
    default:
      return <FaInfoCircle />;
  }
};

export default function CreateBookingForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hotel } = useHotel();
  console.log(`- - - - Hotel Object in Booking Form`);
  console.log(hotel);

  // Initialize formData with hardcoded and default values
  const [formData, setFormData] = useState<Partial<NewBookingFormData>>({
    booking_type: "Physical", // Hardcoded as per request
    booking_status: "Confirmed", // Hardcoded as per request
    number_of_booked_property: 1, // Default value
    // microservice_item_id will be set from hotel.id below
    // property_id will be set from roomDetails.hotel_id below
    // property_item will be set from roomDetails.id below
    // 'property_item_type' and 'amount_required' will be set in useEffect from roomDetails
  });
  const [submissionConfirmed, setSubmissionConfirmed] = useState(false);

  // --- FETCH ROOM DETAILS ---
  // This fetch is crucial for getting 'price_per_night' and 'room_type_name'
  const {
    data: roomDetails,
    isLoading: isLoadingRoomDetails,
    isError: isErrorRoomDetails,
    error: roomDetailsError,
  } = useQuery<RoomDetail, Error>({
    queryKey: ["roomDetails", roomId],
    queryFn: async () => {
      if (!roomId) {
        throw new Error("Room ID is missing for fetching details.");
      }
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/rooms/${roomId}/`
      );
      // Ensure price and rating are parsed correctly from string to number
      return {
        ...response.data,
        price_per_night: parseFloat(response.data.price_per_night),
        average_rating: parseFloat(response.data.average_rating),
      };
    },
    enabled: !!roomId, // Only run this query if roomId is available
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
  });

  // Effect to update formData with room details once fetched
  useEffect(() => {
    if (roomDetails && hotel?.id) {
      setFormData((prev) => ({
        ...prev,
        amount_required: roomDetails.price_per_night, // Hardcoded price from room details
        property_item_type: roomDetails.room_type_name,
        property_id: roomDetails.hotel_id, // Get property_id from roomDetails
        microservice_item_id: hotel.id, // Get microservice_item_id from hotel context
        property_item: roomDetails.id, // Set property_item to the room's ID
      }));
    }
  }, [roomDetails, hotel]); // Re-run when roomDetails or hotel changes

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
      queryClient.invalidateQueries({ queryKey: ["hotelBookings", hotel.id] });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Store as YYYY-MM-DD
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

    // Basic validation to ensure required fields (already marked with *) are present
    const requiredFields: Array<keyof NewBookingFormData> = [
      "full_name",
      "phone_number",
      "email",
      "checkin",
      "checkout",
      "amount_required",
      "property_item_type",
      "property_item",
      "property_id",
      "microservice_item_id",
      "booking_type",
      "booking_status",
      "number_of_booked_property",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] && formData[field] !== 0
    );

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Construct the payload with both user inputs and hardcoded values
    // Ensure numbers are numbers and strings are strings
    const bookingDataToSend: NewBookingFormData = {
      full_name: formData.full_name!,
      phone_number: Number(formData.phone_number!),
      amount_required: parseFloat(formData.amount_required!.toString()), // Convert to float
      property_item_type: formData.property_item_type!,
      property_item: formData.property_item!,
      property_id: formData.property_id!,
      microservice_item_id: formData.microservice_item_id!,
      start_date: formData.checkin!, // Using checkin date as start_date
      end_date: formData.checkout!, // Using checkout date as end_date
      checkin: formData.checkin!,
      checkout: formData.checkout!,
      address: formData.address || null, // Send null if not provided
      email: formData.email!,
      booking_type: formData.booking_type!,
      booking_status: formData.booking_status!,
      number_of_booked_property: formData.number_of_booked_property || 1, // Default to 1 if not set
      special_requests: formData.special_requests || null,
      service_notes: formData.service_notes || null,
      voucher_code: formData.voucher_code || null,
      // Rating is not part of this form, so omit it from payload
    };

    console.log("Final payload being sent:", bookingDataToSend); // Console log before mutation
    createBookingMutation.mutate(bookingDataToSend);
  };

  const handleToggleConfirmation = () => {
    setSubmissionConfirmed(!submissionConfirmed);
  };

  // --- RENDER LOGIC ---
  if (hotel.loading) {
    // Using hotel.loading from useHotel hook
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-lg shadow border border-gray-200">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#553ED0] border-t-transparent mx-auto mb-4 text-[#553ED0]" />
          <p className="text-[#334155] font-semibold text-lg">
            Loading Hotel Information...
          </p>
          <p className="text-[#6B7280] text-sm mt-1">
            Getting hotel details to create booking.
          </p>
        </div>
      </div>
    );
  }

  if (hotel.error) {
    // Using hotel.error from useHotel hook
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="Error Loading Hotel!"
        description={hotel.error || "Could not retrieve hotel information."}
        type="error"
      />
    );
  }

  if (!hotel.id) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="No Hotel Selected or Found"
        description="Cannot create booking without hotel context. Please ensure a hotel is selected or configured in the system."
        type="info"
      />
    );
  }

  if (isLoadingRoomDetails) {
    return <CustomLoader message="Loading Room Details..." />;
  }

  if (isErrorRoomDetails) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="Error Loading Room Details!"
        description={
          roomDetailsError?.message || "An unexpected error occurred."
        }
        type="error"
      />
    );
  }

  if (!roomDetails) {
    return (
      <NoDataMessage
        icon={FaInfoCircle}
        title="Room Not Found"
        description={`The room with ID "${roomId}" could not be found or is not available. Try going back and selecting another room.`}
        type="info"
      >
        <button
          onClick={() => navigate("/bookings/available-rooms")}
          className="mt-6 px-6 py-2 bg-[#553ED0] text-white font-medium rounded-lg hover:bg-[#432DBA] transition-colors shadow"
        >
          Go Back to Available Rooms
        </button>
      </NoDataMessage>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen text-[#202020] font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E7EBF5] h-fit">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#202020]">
              New Booking for Room {roomDetails.code}
            </h1>
            <button
              onClick={() => navigate("/bookings/available-rooms")} // Corrected navigation to available-rooms
              className="flex items-center gap-2 px-4 py-2 border border-[#E8E8E8] text-[#6B7280] rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              <FaArrowLeft /> Back to Rooms
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Header */}
            <div>
              <h2 className="text-xl font-semibold text-[#334155] mb-4">
                Guest Information
              </h2>
            </div>

            {/* Main Form Inputs */}
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
                  value={formData.full_name || ""}
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
                  value={formData.email || ""}
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
                  value={formData.phone_number || ""}
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
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                />
              </div>
              <div>
                <label
                  htmlFor="checkin"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="checkin"
                  name="checkin"
                  value={formData.checkin || ""}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="checkout"
                  className="block text-sm font-medium text-[#6B7280] mb-1"
                >
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="checkout"
                  name="checkout"
                  value={formData.checkout || ""}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
                  required
                />
              </div>
              {/* Removed Special Requests Input */}
              {/* Removed Voucher Code Input */}
            </div>

            {/* Form Footer: Confirmation */}
            <div className="pt-6 border-t border-[#E8E8E8] mt-6">
              <h2 className="text-xl font-semibold text-[#334155] mb-4">
                Booking Summary
              </h2>
              <div className="bg-[#F8FAFC] p-4 rounded-md border border-[#E7EBF5] text-sm text-[#202020] space-y-2">
                <p>
                  <span className="font-medium">Guest Name:</span>{" "}
                  {formData.full_name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {formData.phone_number || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Check-in Date:</span>{" "}
                  {formData.checkin || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Check-out Date:</span>{" "}
                  {formData.checkout || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Hotel:</span>{" "}
                  {hotel.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Room Type:</span>{" "}
                  {roomDetails.room_type_name || "N/A"} (Room {roomDetails.code}
                  )
                </p>
                <p>
                  <span className="font-medium">Amount Due:</span> $
                  {formData.amount_required?.toFixed(2) || "0.00"}
                </p>
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
                disabled={
                  createBookingMutation.isPending || !submissionConfirmed
                }
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

        {/* Room Details Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E7EBF5]">
          <h2 className="text-2xl font-bold text-[#202020] mb-6">
            Room Details: {roomDetails.code}
          </h2>
          <div className="mb-6 rounded-lg overflow-hidden border border-[#E8E8E8]">
            <img
              src={
                roomDetails.image ||
                "https://placehold.co/600x400/e0e0e0/555555?text=Room+Image"
              }
              alt={`Room ${roomDetails.code}`}
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
          <div className="space-y-4 text-[#202020]">
            <p className="text-lg">
              <span className="font-semibold text-[#334155]">Description:</span>{" "}
              {roomDetails.description}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <FaDollarSign className="text-[#059669]" />
              <span className="font-semibold text-[#334155]">
                Price Per Night:
              </span>{" "}
              ${roomDetails.price_per_night?.toFixed(2)}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <FaBed className="text-[#553ED0]" />
              <span className="font-semibold text-[#334155]">
                Room Type:
              </span>{" "}
              {roomDetails.room_type_name}
            </p>
            <p className="flex items-center gap-2 text-lg">
              <FaUsers className="text-[#553ED0]" />
              <span className="font-semibold text-[#334155]">
                Max Occupancy:
              </span>{" "}
              {roomDetails.max_occupancy} people
            </p>
            <p className="flex items-center gap-2 text-lg">
              <FaStar className="text-amber-400" />
              <span className="font-semibold text-[#334155]">
                Average Rating:
              </span>{" "}
              {parseFloat(roomDetails.average_rating).toFixed(1)} (
              {roomDetails.review_count} reviews)
            </p>

            <h3 className="text-xl font-semibold text-[#334155] pt-4 border-t border-[#E8E8E8] mt-4">
              Amenities
            </h3>
            {roomDetails.amenities && roomDetails.amenities.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                {roomDetails.amenities.map((amenity) => (
                  <li key={amenity.id} className="flex items-center gap-2">
                    <span className="text-[#553ED0]">
                      {getAmenityIcon(amenity.icon)}
                    </span>{" "}
                    {amenity.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B7280]">
                No amenities listed for this room.
              </p>
            )}
          </div>
        </div>
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
