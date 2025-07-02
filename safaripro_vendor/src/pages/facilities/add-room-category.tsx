// add-room-category.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FaCode,
  FaHeading,
  FaAlignLeft,
  FaUsers,
  FaBed,
  FaCheckCircle,
  FaImage,
  FaRulerCombined,
  FaDollarSign,
  FaHotel,
  FaPlus,
  FaSyncAlt, // For loading spinner
  FaExclamationCircle, // For error icon
} from "react-icons/fa"; // Imported React Icons

// Define API functions for react-query
const fetchFacilities = async () => {
  const response = await fetch(
    "https://hotel.tradesync.software/api/v1/facilities/"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch facilities");
  }
  return response.json();
};

const fetchAmenities = async () => {
  const response = await fetch(
    "https://hotel.tradesync.software/api/v1/amenities/"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch amenities");
  }
  return response.json();
};

const createRoomCategory = async (newRoomCategory: any) => {
  const response = await fetch(
    "https://hotel.tradesync.software/api/v1/room-types/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoomCategory),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to add room category.");
  }
  return response.json();
};

export default function AddRoomCategory() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    max_occupancy: "",
    bed_type: "",
    room_availability: "",
    image: "",
    size_sqm: "",
    base_price: "",
    facilities: [],
    amenities: [],
  });

  // Fetch available facilities using useQuery
  const {
    data: facilitiesData,
    isLoading: isLoadingFacilities,
    isError: isErrorFacilities,
    error: errorFacilities,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: fetchFacilities,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Fetch available amenities using useQuery
  const {
    data: amenitiesData,
    isLoading: isLoadingAmenities,
    isError: isErrorAmenities,
    error: errorAmenities,
  } = useQuery({
    queryKey: ["amenities"],
    queryFn: fetchAmenities,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Mutation for creating a new room category
  const {
    mutate: addRoomCategory,
    isLoading: isAddingRoomCategory,
    isSuccess: isRoomCategoryAdded,
    isError: isRoomCategoryError,
    error: roomCategoryError,
  } = useMutation({
    mutationFn: createRoomCategory,
    onSuccess: () => {
      toast.success("Room category added successfully!");
      setFormData({
        code: "",
        name: "",
        description: "",
        max_occupancy: "",
        bed_type: "",
        room_availability: "",
        image: "",
        size_sqm: "",
        base_price: "",
        facilities: [],
        amenities: [],
      });
    },
    onError: (error: any) => {
      toast.error(`Error adding room category: ${error.message}`);
      console.error("Room category submission error:", error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const newFacilities = checked
        ? [...prevData.facilities, value]
        : prevData.facilities.filter((facilityId) => facilityId !== value);
      return {
        ...prevData,
        facilities: newFacilities as never[], // Type assertion
      };
    });
  };

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const newAmenities = checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((amenityId) => amenityId !== value);
      return {
        ...prevData,
        amenities: newAmenities as never[], // Type assertion
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data to be sent:", formData);
    addRoomCategory(formData);
  };

  const availableFacilities = facilitiesData?.results || [];
  const availableAmenities = amenitiesData?.results || [];

  if (isLoadingFacilities || isLoadingAmenities) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB] dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <FaSyncAlt className="animate-spin text-4xl text-[#0078D3] dark:text-[#4FD8EF] mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading available facilities and amenities...
          </p>
        </div>
      </div>
    );
  }

  if (isErrorFacilities || isErrorAmenities) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-950">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-red-300 dark:border-red-700">
          <FaExclamationCircle className="text-4xl text-red-600 dark:text-red-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-red-800 dark:text-red-300">
            Error loading initial data:{" "}
            {errorFacilities?.message ||
              errorAmenities?.message ||
              "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Add New Room Category
      </h2>
      <p className="mb-8 text-center leading-relaxed text-gray-600 dark:text-gray-300">
        Fill out the form below to add a new room category to the hotel. Provide
        details and select relevant facilities and amenities.
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
      >
        <div className="col-span-1">
          <label
            htmlFor="code"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaCode className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Code:
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaHeading className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaAlignLeft className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 resize-y transition-colors duration-200"
          ></textarea>
        </div>

        <div className="col-span-1">
          <label
            htmlFor="max_occupancy"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaUsers className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Max Occupancy:
          </label>
          <input
            type="number"
            id="max_occupancy"
            name="max_occupancy"
            value={formData.max_occupancy}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="bed_type"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaBed className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Bed Type:
          </label>
          <input
            type="text"
            id="bed_type"
            name="bed_type"
            value={formData.bed_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="room_availability"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaCheckCircle className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Room Availability:
          </label>
          <input
            type="number"
            id="room_availability"
            name="room_availability"
            value={formData.room_availability}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="image"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaImage className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Image URL:
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="size_sqm"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaRulerCombined className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Size (sqm):
          </label>
          <input
            type="number"
            id="size_sqm"
            name="size_sqm"
            value={formData.size_sqm}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <div className="col-span-1">
          <label
            htmlFor="base_price"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            <FaDollarSign className="inline mr-2 text-gray-500 dark:text-gray-400" />
            Base Price:
          </label>
          <input
            type="number"
            id="base_price"
            name="base_price"
            value={formData.base_price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        {/* Room Facilities */}
        <div className="md:col-span-2 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FaHotel className="mr-3 text-blue-600 dark:text-blue-400" /> Room
            Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFacilities.map((facility: any) => (
              <div key={facility.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${facility.id}`}
                  name="facilities"
                  value={facility.id}
                  checked={formData.facilities.includes(facility.id as never)}
                  onChange={handleFeatureChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor={`feature-${facility.id}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {facility.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Room Amenities */}
        <div className="md:col-span-2 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FaBed className="mr-3 text-green-600 dark:text-green-400" /> Room
            Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableAmenities.map((amenity: any) => (
              <div key={amenity.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  name="amenities"
                  value={amenity.id}
                  checked={formData.amenities.includes(amenity.id as never)}
                  onChange={handleAmenityChange}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor={`amenity-${amenity.id}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {amenity.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isAddingRoomCategory}
          className={`md:col-span-2 flex items-center justify-center px-6 py-3 bg-[#0B9EFF] text-white rounded-lg font-bold text-lg shadow transition-all duration-300
            ${
              isAddingRoomCategory
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 transform hover:scale-105"
            }
            dark:bg-blue-600 dark:hover:bg-blue-500`}
        >
          {isAddingRoomCategory ? (
            <>
              <FaSyncAlt className="animate-spin mr-3" /> Adding Category...
            </>
          ) : (
            <>
              <FaPlus className="mr-3" /> Add Room Category
            </>
          )}
        </button>
      </form>
    </div>
  );
}
