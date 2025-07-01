import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "react-toastify"; // For notifications

export default function NewHotelType() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  // * - - - Mutation for Creating New Hotel Type
  const createHotelTypeMutation = useMutation({
    mutationFn: async (newHotelTypeData: {
      name: string;
      code: string;
      description: string;
    }) => {
      const response = await hotelClient.post(
        "v1/hotel-types/",
        newHotelTypeData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Hotel Type created successfully!");
      navigate("/hotels/hotel-types");
    },
    onError: (err: any) => {
      toast.error(
        `Error creating hotel type: ${
          err.message || "An unknown error occurred"
        }`
      );
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHotelTypeMutation.mutate(formData);
  };

  return (
    <div className="p-6">
      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Hotel Type
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8"
      >
        {/* Form Body (Inputs) */}
        <div className="space-y-4">
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
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
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
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
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
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
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
              {formData.name || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Code:</strong>{" "}
              {formData.code || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Description:</strong>{" "}
              {formData.description || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={createHotelTypeMutation.isPending}
          >
            {createHotelTypeMutation.isPending
              ? "Creating..."
              : "Create Hotel Type"}
          </button>
          {createHotelTypeMutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              Failed to create hotel type. Please try again.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
