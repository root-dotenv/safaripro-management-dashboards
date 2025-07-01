// src/pages/facilities/new-facilities.tsx
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Facility } from "../../types/facilities";

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
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  availability: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  category_id: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  fee_applies: yup.boolean().default(false),
  reservation_required: yup.boolean().default(false),
  additional_info: yup
    .string()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),
  is_active: yup.boolean().default(true),
});

export default function NewFacility() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Facility>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      icon: null,
      availability: null,
      category_id: null,
      fee_applies: false,
      reservation_required: false,
      additional_info: null,
      is_active: true,
    },
  });

  const watchFields = watch();

  // Mutation for Creating New Facility
  const createFacilityMutation = useMutation({
    mutationFn: async (
      newFacilityData: Omit<
        Facility,
        | "id"
        | "created_at"
        | "updated_at"
        | "category_name"
        | "additional_info_parsed"
        | "hotel_count"
        | "translation_id"
        | "translation_language"
      >
    ) => {
      const response = await hotelClient.post(
        "v1/facilities/",
        newFacilityData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Facility created successfully!");
      navigate("/facilities/all-facilities");
    },
    onError: (err: any) => {
      toast.error(
        `Error creating facility: ${err.message || "An unknown error occurred"}`
      );
    },
  });

  const onSubmit = (data: Facility) => {
    const payload = {
      name: data.name,
      code: data.code,
      description: data.description,
      icon: data.icon,
      availability: data.availability,
      category_id: data.category_id,
      fee_applies: data.fee_applies,
      reservation_required: data.reservation_required,
      additional_info: data.additional_info,
      is_active: data.is_active,
    };
    createFacilityMutation.mutate(payload);
  };

  return (
    <div className="p-6">
      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Facility
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
              required
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
              required
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
              Icon (e.g., car, pool, wifi)
            </label>
            <input
              type="text"
              id="icon"
              {...register("icon")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional"
            />
            {errors.icon && (
              <p className="text-red-500 text-xs mt-1">{errors.icon.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-700"
            >
              Availability
            </label>
            <input
              type="text"
              id="availability"
              {...register("availability")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional"
            />
            {errors.availability && (
              <p className="text-red-500 text-xs mt-1">
                {errors.availability.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700"
            >
              Category ID
            </label>
            <input
              type="text"
              id="category_id"
              {...register("category_id")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional"
            />
            {errors.category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="additional_info"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Info
            </label>
            <textarea
              id="additional_info"
              {...register("additional_info")}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optional"
            ></textarea>
            {errors.additional_info && (
              <p className="text-red-500 text-xs mt-1">
                {errors.additional_info.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="fee_applies"
              {...register("fee_applies")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="fee_applies"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Fee Applies
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reservation_required"
              {...register("reservation_required")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="reservation_required"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Reservation Required
            </label>
          </div>
          <div className="flex items-center">
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
              <strong className="font-semibold">Availability:</strong>{" "}
              {watchFields.availability || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Category ID:</strong>{" "}
              {watchFields.category_id || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Fee Applies:</strong>{" "}
              {watchFields.fee_applies ? "Yes" : "No"}
            </p>
            <p>
              <strong className="font-semibold">Reservation Required:</strong>{" "}
              {watchFields.reservation_required ? "Yes" : "No"}
            </p>
            <p>
              <strong className="font-semibold">Additional Info:</strong>{" "}
              {watchFields.additional_info || "N/A"}
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
            disabled={createFacilityMutation.isPending}
          >
            {createFacilityMutation.isPending
              ? "Creating..."
              : "Create Facility"}
          </button>
        </div>
      </form>
    </div>
  );
}
