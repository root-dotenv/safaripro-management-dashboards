// add-room.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useHotelContext } from "../../context/hotel-context";
import {
  FaCode,
  FaFileAlt,
  FaBed,
  FaDollarSign,
  FaCheckCircle,
  FaImage,
  FaUsers,
  FaInfoCircle,
  FaSpinner,
  FaTags,
} from "react-icons/fa"; // Imported React Icons

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
  max_occupancy: yup.string().required("Max occupancy is required"),
  price_per_night: yup.string().required("Price per night is required"),
  availability_status: yup
    .string()
    .required("Availability status is required")
    .oneOf(
      ["Available", "Booked", "Under Maintenance"],
      "Invalid availability status"
    ),
  room_amenities: yup.array().of(yup.string()).optional(),
  image: yup
    .string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
});

type RoomFormData = yup.InferType<typeof roomSchema>;

interface CreateRoomPayload extends RoomFormData {
  hotel: string;
}

// API function to create room
const createRoom = async (roomData: CreateRoomPayload): Promise<any> => {
  const hotelId = roomData.hotel;
  const payload = {
    code: roomData.code,
    description: roomData.description,
    room_type: roomData.room_type,
    max_occupancy: roomData.max_occupancy,
    price_per_night: roomData.price_per_night,
    availability_status: roomData.availability_status,
    image: roomData.image,
    room_amenities: roomData.room_amenities,
    hotel: hotelId,
    review_count: "0",
    average_rating: "0.0",
  };

  const response = await axios.post(
    `https://hotel.tradesync.software/api/v1/rooms/?hotel_id=${hotelId}/`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default function AddRoom() {
  const hotel = useHotelContext();

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
      const hotelId = hotel?.id || "";
      if (!hotelId) {
        throw new Error("Hotel ID is not available.");
      }
      return createRoom({
        ...data,
        hotel: hotelId,
      });
    },
    onSuccess: (data) => {
      console.log("Room created successfully:", data);
      alert("Room created successfully!");
      reset();
    },
    onError: (error: any) => {
      console.error("Error creating room:", error);
      alert(
        `Error creating room: ${error.response?.data?.message || error.message}`
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

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Form Header */}
        <div className="bg-[#F3F5F7] dark:bg-gray-800 rounded-lg shadow mb-6 p-6 border border-[#E7EBF5] dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Add New Room
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new room for your hotel
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isFormValid ? "bg-[#04C604]" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isFormValid ? "Form Valid" : "Form Invalid"}
              </span>
            </div>
          </div>
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
                  {hotel?.room_type?.map((type) => (
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
                  {...register("max_occupancy", { valueAsNumber: true })}
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
                  {...register("price_per_night", { valueAsNumber: true })}
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
                {hotel?.room_type
                  ?.flatMap((rt) => rt.amenities)
                  .filter(
                    (amenity, index, self) =>
                      amenity &&
                      self.findIndex((a) => a.id === amenity.id) === index
                  )
                  .map((amenity) => (
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
                        "https://via.placeholder.com/150?text=Image+Load+Error";
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
                <option value="Under Maintenance">Under Maintenance</option>
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
                  {hotel?.room_type?.find(
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
                          (id) =>
                            hotel?.room_type
                              ?.flatMap((rt) => rt.amenities)
                              .find((amenity) => amenity?.id === id)?.name
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
