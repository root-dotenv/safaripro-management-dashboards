import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { useState, useEffect } from "react";
import { type RoomType } from "../../types/room-types";
import { toast } from "react-toastify";

// Define an interface for the detailed RoomType response
interface DetailedRoomType extends RoomType {
  translation_id: string | null;
  translation_language: string | null;
  room_count: number;
  features_list: Array<{ id: string; name: string; description: string }>;
  amenities_details: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

export default function EditRoomType() {
  const { room_type_id } = useParams<{ room_type_id: string }>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<DetailedRoomType>>({});

  // Fetch room type details
  const {
    data: roomTypeDetails,
    isLoading,
    isError,
    error,
  } = useQuery<DetailedRoomType>({
    queryKey: ["roomType", room_type_id],
    queryFn: async () => {
      const response = await hotelClient.get(`v1/room-types/${room_type_id}/`);
      return response.data;
    },
    enabled: !!room_type_id,
    refetchOnWindowFocus: false,
  });

  // Populate form data when roomTypeDetails are loaded
  useEffect(() => {
    if (roomTypeDetails) {
      setFormData({
        name: roomTypeDetails.name,
        code: roomTypeDetails.code,
        description: roomTypeDetails.description,
        bed_type: roomTypeDetails.bed_type,
        max_occupancy: roomTypeDetails.max_occupancy,
        room_availability: roomTypeDetails.room_availability,
        image: roomTypeDetails.image,
        size_sqm: roomTypeDetails.size_sqm,
        base_price: roomTypeDetails.base_price,
        is_active: roomTypeDetails.is_active,
      });
    }
  }, [roomTypeDetails]);

  // Mutation for updating room type
  const updateRoomTypeMutation = useMutation({
    mutationFn: (updatedData: Partial<DetailedRoomType>) => {
      return hotelClient.patch(`v1/room-types/${room_type_id}/`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomType", room_type_id] });
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
      toast.success("Room Type updated successfully!");
    },
    onError: (err: any) => {
      toast.error(
        `Error updating room type: ${
          err.message || "An unknown error occurred"
        }`
      );
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare data for submission, ensuring correct types if needed
    const dataToSubmit = {
      ...formData,
      max_occupancy: Number(formData.max_occupancy),
      room_availability: Number(formData.room_availability),
      size_sqm: formData.size_sqm !== null ? Number(formData.size_sqm) : null,
      base_price: formData.base_price,
    };
    updateRoomTypeMutation.mutate(dataToSubmit);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div>Error loading room type details: {error?.message}</div>;
  }

  if (!roomTypeDetails) {
    return <div>No room type found for ID: {room_type_id}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Edit Room Type: {roomTypeDetails.name} (ID: {room_type_id})
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Code */}
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4 col-span-1 md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>

          {/* Bed Type */}
          <div className="mb-4">
            <label
              htmlFor="bed_type"
              className="block text-sm font-medium text-gray-700"
            >
              Bed Type
            </label>
            <input
              type="text"
              id="bed_type"
              name="bed_type"
              value={formData.bed_type || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Max Occupancy */}
          <div className="mb-4">
            <label
              htmlFor="max_occupancy"
              className="block text-sm font-medium text-gray-700"
            >
              Max Occupancy
            </label>
            <input
              type="number"
              id="max_occupancy"
              name="max_occupancy"
              value={formData.max_occupancy || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Room Availability */}
          <div className="mb-4">
            <label
              htmlFor="room_availability"
              className="block text-sm font-medium text-gray-700"
            >
              Room Availability
            </label>
            <input
              type="number"
              id="room_availability"
              name="room_availability"
              value={formData.room_availability || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Room Type Preview"
                  className="h-24 w-auto rounded-md object-cover"
                />
              </div>
            )}
          </div>

          {/* Size (SQM) */}
          <div className="mb-4">
            <label
              htmlFor="size_sqm"
              className="block text-sm font-medium text-gray-700"
            >
              Area (SQM)
            </label>
            <input
              type="number"
              id="size_sqm"
              name="size_sqm"
              value={formData.size_sqm || ""}
              onChange={handleChange}
              step="0.01" // Allow decimal values
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Base Price */}
          <div className="mb-4">
            <label
              htmlFor="base_price"
              className="block text-sm font-medium text-gray-700"
            >
              Base Price
            </label>
            <input
              type="text"
              id="base_price"
              name="base_price"
              value={formData.base_price || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          {/* Is Active */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active || false}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Is Active
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={updateRoomTypeMutation.isPending}
          >
            {updateRoomTypeMutation.isPending
              ? "Updating..."
              : "Update Room Type"}
          </button>
        </div>
      </form>

      {/* Display Features and Amenities (read-only for now) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          {roomTypeDetails.features_list &&
          roomTypeDetails.features_list.length > 0 ? (
            <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow-md">
              {roomTypeDetails.features_list.map((feature) => (
                <li key={feature.id} className="text-gray-700">
                  {feature.name}: {feature.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No features listed.</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Amenities</h3>
          {roomTypeDetails.amenities_details &&
          roomTypeDetails.amenities_details.length > 0 ? (
            <ul className="list-disc list-inside bg-white p-4 rounded-lg shadow-md">
              {roomTypeDetails.amenities_details.map((amenity) => (
                <li key={amenity.id} className="text-gray-700">
                  {amenity.name}: {amenity.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No amenities listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
