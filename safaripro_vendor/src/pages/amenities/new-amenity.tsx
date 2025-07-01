// src/pages/amenities/new-amenity.tsx
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Amenity } from "../../types/amenities"; // Import Amenity type for form

// Define validation schema using Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  code: yup
    .string()
    .required("Code is required")
    .min(2, "Code must be at least 2 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  icon: yup
    .string()
    .required("Icon is required")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Icon can only contain letters, numbers, hyphens, and underscores"
    ), // Basic validation for icon string
  usage_count: yup
    .number()
    .integer()
    .min(0, "Usage count cannot be negative")
    .default(0),
  is_active: yup.boolean().default(true),
});

export default function NewAmenity() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Amenity>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      icon: "",
      usage_count: 0,
      is_active: true,
    },
  });

  const watchFields = watch();

  // Mutation for Creating New Amenity
  const createAmenityMutation = useMutation({
    mutationFn: async (
      newAmenityData: Omit<Amenity, "id" | "created_at" | "updated_at">
    ) => {
      const response = await hotelClient.post("v1/amenities/", newAmenityData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Amenity created successfully!");
      navigate("/amenities");
    },
    onError: (err: any) => {
      toast.error(
        `Error creating amenity: ${err.message || "An unknown error occurred"}`
      );
    },
  });

  const onSubmit = (data: Amenity) => {
    const payload = {
      name: data.name,
      code: data.code,
      description: data.description,
      icon: data.icon,
      usage_count: data.usage_count,
      is_active: data.is_active,
    };
    createAmenityMutation.mutate(payload);
  };

  return (
    <div className="p-6">
      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Amenity
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8"
      >
        {/* Form Body (Inputs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {...register("name")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
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
              {...register("code")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700"
            >
              Icon (e.g., wifi, lock, tv)
            </label>
            <input
              type="text"
              id="icon"
              {...register("icon")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.icon && (
              <p className="text-red-500 text-xs mt-1">{errors.icon.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="usage_count"
              className="block text-sm font-medium text-gray-700"
            >
              Usage Count
            </label>
            <input
              type="number"
              id="usage_count"
              {...register("usage_count")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.usage_count && (
              <p className="text-red-500 text-xs mt-1">
                {errors.usage_count.message}
              </p>
            )}
          </div>
          <div className="flex items-center md:col-span-2">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
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

        {/* Form Footer (Inputs for verification) */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Review Your Entry:
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong className="font-semibold">Name:</strong>{" "}
              {watchFields.name || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Code:</strong>{" "}
              {watchFields.code || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Description:</strong>{" "}
              {watchFields.description || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Icon:</strong>{" "}
              {watchFields.icon || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Usage Count:</strong>{" "}
              {watchFields.usage_count?.toString() || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Is Active:</strong>{" "}
              {watchFields.is_active ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={createAmenityMutation.isPending}
          >
            {createAmenityMutation.isPending ? "Creating..." : "Create Amenity"}
          </button>
        </div>
      </form>
    </div>
  );
}
