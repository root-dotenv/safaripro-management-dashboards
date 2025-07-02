// edit-room.tsx
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCode,
  FaTag,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaImage,
  FaAlignLeft,
  FaSave,
  FaBan,
  FaSpinner,
} from "react-icons/fa"; // Imported React Icons
import { useHotel } from "../../providers/hotel-provider";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { hotel } = useHotel();

  // State to manage form data
  const [formData, setFormData] = useState({
    code: "",
    room_type: "",
    price_per_night: "",
    max_occupancy: "",
    availability_status: "",
    image: "",
    description: "",
  });

  // Define required fields for basic validation
  const requiredFields = [
    "code",
    "room_type",
    "price_per_night",
    "max_occupancy",
    "availability_status",
  ];

  // Basic form validation check
  const isFormValid = useMemo(() => {
    return requiredFields.every((field) => {
      const value = (formData as any)[field]; // Use 'any' to bypass TS error on dynamic access
      return value !== "" && value !== null && value !== undefined;
    });
  }, [formData]);

  // Fetch specific room data
  const {
    data: roomData,
    isLoading: isRoomLoading,
    isError: isRoomError,
    error: roomError,
  } = useQuery({
    queryKey: ["room-detail", roomId],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/rooms/${roomId}/` // Hardcoded URL as requested
      );
      return response.data;
    },
    enabled: !!roomId,
    onSuccess: (data) => {
      setFormData({
        code: data.code || "",
        room_type: data.room_type || "",
        price_per_night: data.price_per_night || "",
        max_occupancy: data.max_occupancy || "",
        availability_status: data.availability_status || "",
        image: data.image || "",
        description: data.description || "",
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for updating the room
  const updateRoomMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      // Type updatedData
      // Hardcoded base URL and added hotel_id as a query parameter for PATCH request
      const response = await axios.patch(
        `https://hotel.tradesync.software/api/v1/rooms/${roomId}/?hotel_id=${hotel.id}`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Room updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-detail", roomId] });
      navigate("/rooms/all-rooms");
    },
    onError: (error: any) => {
      // Type error
      console.error("Failed to update room:", error);
      toast.error(
        `Failed to update room: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target; // Removed type and checked as they are not universally applicable
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      if (hotel.id) {
        updateRoomMutation.mutate(formData);
      } else {
        toast.error("Hotel ID is not available. Cannot update room.");
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  if (isRoomLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
        <div className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
          <FaSpinner className="animate-spin mr-3 text-2xl text-[#0078D3] dark:text-[#4FD8EF]" />
          Loading room details...
        </div>
      </div>
    );
  }

  if (isRoomError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-950">
        <div className="text-red-600 dark:text-red-400 text-lg flex items-center">
          <FaExclamationCircle className="mr-3 text-2xl" />
          Error loading room details: {roomError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Form Header */}
        <div className="bg-[#F3F5F7] dark:bg-gray-800 rounded-lg shadow mb-6 p-6 border border-[#E7EBF5] dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Edit Room: {formData.code || "Loading..."}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update the details for this room
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

        {/* Main Form Body */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 border border-[#E7EBF5] dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Room Details */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
              Room Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaCode className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Room Number *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="room_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaTag className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Room Type *
                </label>
                <input
                  type="text"
                  id="room_type"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="price_per_night"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaDollarSign className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Price Per Night ($) *
                </label>
                <input
                  type="number"
                  id="price_per_night"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="max_occupancy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaUsers className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Max Occupancy *
                </label>
                <input
                  type="number"
                  id="max_occupancy"
                  name="max_occupancy"
                  value={formData.max_occupancy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Other Details */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 pb-3 mb-4">
              Other Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="availability_status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaCheckCircle className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Availability Status *
                </label>
                <select
                  id="availability_status"
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  {/* Add other statuses as per your backend model */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaImage className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {formData.image && (
                <div className="mt-2 p-3 bg-[#F2F7FA] dark:bg-gray-700 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image Preview:
                  </span>
                  <img
                    src={formData.image}
                    alt="Room Preview"
                    className="h-32 w-auto object-cover rounded-md shadow border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  <FaAlignLeft className="inline mr-2 text-gray-500 dark:text-gray-400" />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-[#0078D3] focus:border-[#0078D3] resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                ></textarea>
              </div>
            </div>

            {/* Submit/Cancel Buttons */}
            <div className="flex justify-end pt-4 space-x-3">
              <button
                type="button"
                onClick={() => navigate("/rooms/all-rooms")}
                className="px-6 py-2 rounded-lg font-medium transition-colors bg-[#F2F7FA] hover:bg-gray-200 text-gray-700 shadow dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                <FaBan className="inline mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid || updateRoomMutation.isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isFormValid && !updateRoomMutation.isLoading
                    ? "bg-[#0B9EFF] hover:bg-blue-700 text-white shadow"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-gray-100 dark:disabled:bg-gray-700`}
              >
                {updateRoomMutation.isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="inline mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Footer - Room Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-[#E7EBF5] dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Room Preview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Room Number:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {formData.code || "N/A"}
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Room Type:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {formData.room_type || "N/A"}
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Price Per Night:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                ${parseFloat(formData.price_per_night || "0").toFixed(2)}
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Max Occupancy:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {formData.max_occupancy || "N/A"} guests
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Availability:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {formData.availability_status || "N/A"}
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600 col-span-full">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Description:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {formData.description || "No description provided."}
              </p>
            </div>
            <div className="bg-[#F2F7FA] dark:bg-gray-700 p-3 rounded-lg border border-[#EEF6FF] dark:border-gray-600 col-span-full">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Image URL:
              </span>
              <p className="mt-1 text-gray-900 dark:text-gray-200 break-all">
                {formData.image || "No image URL."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
