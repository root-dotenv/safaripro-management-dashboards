// edit-hotel-type.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { useState, useEffect } from "react";
import type { HotelType } from "../../types/hotel-types";
import { toast } from "react-toastify";

export default function EditHotelType() {
  const { hotel_type_id } = useParams<{ hotel_type_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<HotelType>>({});

  // * - - - Fetch Hotel Type Details
  const {
    data: hotelTypeDetails,
    isLoading,
    isError,
    error,
  } = useQuery<HotelType>({
    queryKey: ["hotelType", hotel_type_id],
    queryFn: async () => {
      const response = await hotelClient.get(
        `v1/hotel-types/${hotel_type_id}/`
      );
      return response.data;
    },
    enabled: !!hotel_type_id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (hotelTypeDetails) {
      setFormData({
        name: hotelTypeDetails.name,
        code: hotelTypeDetails.code,
        description: hotelTypeDetails.description,
        is_active: hotelTypeDetails.is_active,
      });
    }
  }, [hotelTypeDetails]);

  // * - - - Mutation for Updating Hotel Type
  const updateHotelTypeMutation = useMutation({
    mutationFn: async (updatedData: Partial<HotelType>) => {
      const response = await hotelClient.patch(
        `v1/hotel-types/${hotel_type_id}/`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelType", hotel_type_id] });
      queryClient.invalidateQueries({ queryKey: ["hotel_types"] });
      toast.success("Hotel Type updated successfully!");
      navigate("/hotels/hotel-types");
    },
    onError: (err: any) => {
      toast.error(
        `Error updating hotel type: ${
          err.message || "An unknown error occurred"
        }`
      );
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    updateHotelTypeMutation.mutate(formData);
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div>Error loading hotel type details: {error?.message}</div>;
  }

  if (!hotelTypeDetails) {
    return <div>No hotel type found for ID: {hotel_type_id}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Edit Hotel Type: {hotelTypeDetails.name} (ID: {hotel_type_id})
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
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
          <div>
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
          <div>
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

          {/* Is Active Status */}
          <div className="flex items-center">
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
            disabled={updateHotelTypeMutation.isPending}
          >
            {updateHotelTypeMutation.isPending
              ? "Updating..."
              : "Update Hotel Type"}
          </button>
        </div>
      </form>
    </div>
  );
}
