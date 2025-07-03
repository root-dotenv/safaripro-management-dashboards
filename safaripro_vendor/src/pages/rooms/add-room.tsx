// add-room.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { useNavigate } from "react-router-dom";
import {
  FaCode,
  FaFileAlt,
  FaDollarSign,
  FaCheckCircle,
  FaImage,
  FaUsers,
  FaInfoCircle,
  FaSpinner,
  FaTags,
  FaExclamationCircle, // Added for error state
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useHotel } from "../../providers/hotel-provider";
import hotelClient from "../../api/hotel-client";
import { toast } from "react-toastify"; // Ensure react-toastify is used
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

// --- TYPE DEFINITIONS ---
interface Amenity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RoomTypeOption {
  id: string;
  name: string;
  code: string;
  description: string;
  max_occupancy: number;
  bed_type: string;
  room_availability: number;
  image: string;
  size_sqm: number | null;
  base_price: string;
  is_active: boolean;
  amenities: string[];
}

// Form validation schema
const roomSchema = yup.object({
  code: yup
    .string()
    .required("Room code is required")
    .min(1, "Room code must be at least 1 character"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  room_type: yup.string().required("Room type is required"),
  max_occupancy: yup
    .string()
    .required("Max occupancy is required")
    .matches(/^[0-9]+$/, "Must be a number")
    .min(1, "Minimum occupancy is 1"),
  price_per_night: yup
    .string()
    .required("Price per night is required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Must be a valid price (e.g., 100.00)")
    .test(
      "is-greater-than-zero",
      "Price must be greater than zero",
      (value) => parseFloat(value) > 0
    ),
  availability_status: yup
    .string()
    .required("Availability status is required")
    .oneOf(
      ["Available", "Booked", "Maintenance"],
      "Invalid availability status"
    ),
  room_amenities: yup.array().of(yup.string()).optional(),
  image: yup
    .string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
});

type RoomFormData = yup.InferType<typeof roomSchema>;

// API function to create room
const createRoom = async (
  data: RoomFormData,
  hotelId: string
): Promise<any> => {
  const payload = {
    code: data.code,
    description: data.description,
    image: data.image,
    max_occupancy: data.max_occupancy,
    price_per_night: data.price_per_night,
    room_type: data.room_type,
    hotel: hotelId,
    room_amenities: data.room_amenities || [],
    availability_status: data.availability_status,
    review_count: "0",
    average_rating: "0.0",
  };

  const response = await hotelClient.post(
    `v1/rooms/?hotel_id=${hotelId}`,
    payload
  );
  return response.data;
};

export default function AddRoom() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Initialize useQueryClient
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel();

  // --- Fetch Room Types ---
  const {
    data: roomTypeOptions,
    isLoading: isLoadingRoomTypes,
    isError: isErrorRoomTypes,
    error: roomTypesError,
  } = useQuery<RoomTypeOption[]>({
    queryKey: ["allRoomTypes"],
    queryFn: async () => {
      const response = await hotelClient.get(`v1/room-types/`);
      return response.data.results;
    },
    staleTime: 1000 * 60 * 5,
  });

  // --- Fetch All Amenities ---
  const {
    data: allAmenities,
    isLoading: isLoadingAmenities,
    isError: isErrorAmenities,
    error: amenitiesError,
  } = useQuery<Amenity[]>({
    queryKey: ["allAmenities"],
    queryFn: async () => {
      const response = await hotelClient.get(`v1/amenities/`);
      return response.data.results;
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<RoomFormData>({
    resolver: yupResolver(roomSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      description: "",
      room_type: "",
      max_occupancy: "",
      price_per_night: "",
      availability_status: "Available",
      room_amenities: [],
      image: "",
    },
  });

  const watchedValues = watch();
  const isFormValid = isValid;

  const createRoomMutation = useMutation({
    mutationFn: (data: RoomFormData) => {
      const hotelId = hotel?.id;
      if (!hotelId) {
        throw new Error("Hotel ID is not available. Cannot create room.");
      }
      return createRoom(data, hotelId);
    },
    onSuccess: (data) => {
      console.log("Room created successfully:", data);
      toast.success("Room created successfully! Redirecting...");
      reset(); // Reset the form fields

      // Invalidate 'rooms' queries to ensure fresh data on AllRooms page
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      // Navigate to All Rooms page after 3 seconds
      setTimeout(() => {
        navigate("/rooms/all-rooms");
      }, 3000);
    },
    onError: (error: any) => {
      console.error("Error creating room:", error);
      toast.error(
        `Error creating room: ${error.response?.data?.detail || error.message}`
      );
    },
  });

  const onSubmit = (data: RoomFormData) => {
    console.log("Form Data Payload:", {
      ...data,
      hotel: hotel?.id,
      review_count: "0",
      average_rating: "0.0",
    });
    createRoomMutation.mutate(data);
  };

  // --- Conditional Loading States ---
  if (hotelLoading || isLoadingRoomTypes || isLoadingAmenities) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 border-4 border-[#0078D3] border-t-transparent mx-auto mb-4 text-[#0078D3] dark:text-[#4FD8EF]" />
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading essential data...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Fetching hotel details, room types, and amenities.
          </p>
        </div>
      </div>
    );
  }

  // --- Conditional Error States ---
  if (hotelError || isErrorRoomTypes || isErrorAmenities) {
    const errorMessage =
      hotelError?.message || // Access message property
      roomTypesError?.message ||
      amenitiesError?.message ||
      "Failed to load required data.";
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaExclamationCircle className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-red-800 dark:text-red-300 mb-3">
            Error Loading Data!
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-md border border-red-200 dark:border-red-600">
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#DB403A] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow dark:bg-red-600 dark:hover:bg-red-500"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Fallback if hotel data is somehow still null after loading without error
  if (!hotel) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-amber-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 p-8 rounded-lg shadow max-w-md w-full text-center">
          <FaInfoCircle className="text-4xl text-amber-600 dark:text-amber-400 mx-auto mb-4" />
          <h3 className="font-bold text-xl text-amber-800 dark:text-amber-300 mb-3">
            Hotel Data Not Available
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900 p-4 rounded-md border border-amber-200 dark:border-amber-600">
            Cannot add rooms without hotel information. Please ensure hotel data
            is loaded correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Section Header */}
        <div className="w-full px-4 py-4">
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-2.5 ">
              <button onClick={() => navigate(-1)}>
                {" "}
                {/* Added navigate back */}
                <IoChevronBackOutline color="#646464" size={18} />
              </button>
              <button onClick={() => navigate(1)}>
                {" "}
                {/* Added navigate forward */}
                <IoChevronForwardOutline color="#646464" size={18} />
              </button>
            </div>
            <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
              Add New Room
            </h1>
          </div>
          <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
            <FaInfoCircle className="inline mr-1.5 opacity-70" size={14} />
            Fill in the details to add a new room to your hotel. All fields are
            required.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 border border-[#E7EBF5] dark:border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Room Code and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <FaCode className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Room Code *
                </label>
                <input
                  {...register("code")}
                  type="text"
                  id="code"
                  placeholder="e.g., 101, A-205"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.code
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="room_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <FaTags className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Room Type *
                </label>
                <select
                  {...register("room_type")}
                  id="room_type"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.room_type
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="">Select room type</option>
                  {roomTypeOptions?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.room_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.room_type.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <FaFileAlt className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Room Description *
              </label>
              <textarea
                {...register("description")}
                id="description"
                rows={3}
                placeholder="Describe the room features, location, and amenities..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Occupancy and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="max_occupancy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <FaUsers className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Max Occupancy *
                </label>
                <input
                  {...register("max_occupancy")}
                  type="text"
                  id="max_occupancy"
                  placeholder="2"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.max_occupancy
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.max_occupancy && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.max_occupancy.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price_per_night"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <FaDollarSign className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Price per Night ($) *
                </label>
                <input
                  {...register("price_per_night")}
                  type="text"
                  id="price_per_night"
                  placeholder="199.99"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.price_per_night
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.price_per_night && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price_per_night.message}
                  </p>
                )}
              </div>
            </div>

            {/* Room Amenities Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCheckCircle className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Room Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                {allAmenities?.map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.id}`}
                      value={amenity.id}
                      {...register("room_amenities")}
                      className="h-4 w-4 text-[#0078D3] border-gray-300 rounded focus:ring-[#0078D3] dark:bg-gray-600 dark:border-gray-500 dark:text-[#4FD8EF] dark:focus:ring-[#4FD8EF]"
                    />
                    <label
                      htmlFor={`amenity-${amenity.id}`}
                      className="ml-2 text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                    >
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Image URL Input */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <FaImage className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Room Image URL *
              </label>
              <input
                {...register("image")}
                type="text"
                id="image"
                placeholder="e.g., https://example.com/room.jpg"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.image
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
              {watchedValues.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview:
                  </p>
                  <img
                    src={watchedValues.image}
                    alt="Room preview"
                    className="h-32 w-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/150x150/E0E0E0/ADADAD?text=Image+Error"; // Updated placeholder
                    }}
                  />
                </div>
              )}
            </div>

            {/* Availability Status */}
            <div>
              <label
                htmlFor="availability_status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <FaInfoCircle className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Availability Status *
              </label>
              <select
                {...register("availability_status")}
                id="availability_status"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0078D3] focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.availability_status
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              {errors.availability_status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.availability_status.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!isValid || createRoomMutation.isPending}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center
                  ${
                    isValid && !createRoomMutation.isPending
                      ? "bg-[#0B9EFF] hover:bg-blue-700 text-white shadow"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                  dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-gray-100 dark:disabled:bg-gray-700`}
              >
                {createRoomMutation.isPending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Room...
                  </>
                ) : (
                  "Create Room"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Footer - Confirmation Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-[#E7EBF5] dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Form Preview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Room Code:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  {watchedValues.code || "Not set"}
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Room Type:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  {roomTypeOptions?.find(
                    (type) => type.id === watchedValues.room_type
                  )?.name || "Not selected"}
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Max Occupancy:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  {watchedValues.max_occupancy || 0} guests
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Price per Night:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  ${watchedValues.price_per_night || 0}
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  {watchedValues.availability_status || "Available"}
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Image URL:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200 truncate">
                  {watchedValues.image || "Not provided"}
                </p>
              </div>
              <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Amenities:
                </span>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                  {watchedValues.room_amenities &&
                  watchedValues.room_amenities.length > 0
                    ? watchedValues.room_amenities
                        .map(
                          (id) => allAmenities?.find((a) => a.id === id)?.name
                        )
                        .filter(Boolean)
                        .join(", ")
                    : "No amenities selected"}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Description:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {watchedValues.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
