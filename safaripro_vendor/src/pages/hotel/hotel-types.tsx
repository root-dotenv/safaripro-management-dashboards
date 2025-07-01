// hotel-types.tsx
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import type { HotelType } from "../../types/hotel-types";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

export default function HotelTypes() {
  const navigate = useNavigate();
  const {
    data: hotel_types,
    isLoading,
    error,
    isError,
  } = useQuery<HotelType[]>({
    queryKey: ["hotel_types"],
    queryFn: async () => {
      const response = await hotelClient.get("v1/hotel-types/");
      return response.data.results;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  // * - - - Mutation for Deleting Hotel Type
  const deleteMutation = useMutation({
    mutationFn: async (hotelTypeId: string) => {
      await hotelClient.delete(`v1/hotel-types/${hotelTypeId}/`);
    },
    onMutate: async (hotelTypeIdToDelete: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["hotel_types"] });

      // Snapshot the previous value
      const previousHotelTypes = queryClient.getQueryData<HotelType[]>([
        "hotel_types",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<HotelType[]>(["hotel_types"], (old) =>
        old
          ? old.filter((hotelType) => hotelType.id !== hotelTypeIdToDelete)
          : []
      );

      // Return a context object with the snapshotted value
      return { previousHotelTypes };
    },
    onSuccess: () => {
      toast.success("Hotel Type deleted successfully!");
    },
    onError: (err, hotelTypeIdToDelete, context) => {
      toast.error(
        `Error deleting hotel type: ${
          err.message || "An unknown error occurred"
        }`
      );
      // Rollback to the previous data if the mutation fails
      if (context?.previousHotelTypes) {
        queryClient.setQueryData<HotelType[]>(
          ["hotel_types"],
          context.previousHotelTypes
        );
      }
    },
    onSettled: () => {
      // Invalidate and refetch after error or success to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["hotel_types"] });
    },
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <p>Error loading hotel types: {error?.message}</p>;
  }

  if (!hotel_types || hotel_types.length === 0) {
    return <div>No hotel types found.</div>;
  }

  console.log("Hotel Types data:", hotel_types);

  // * - - - Actions Handlers
  const handleDelete = (hotelTypeId: string, hotelTypeName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the hotel type "${hotelTypeName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(hotelTypeId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  const handleEdit = (hotelTypeId: string) => {
    navigate(`/hotels/hotel-types/${hotelTypeId}`);
  };

  return (
    <div className="p-6 text-[0.875rem]">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#E5E6FF]">
          <tr>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              S/N
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Code
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Actions
            </th>{" "}
            {/* New Actions column header */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hotel_types.map((hotelType, index) => (
            <tr key={hotelType.id} className="hover:bg-gray-50">
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {index + 1}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {hotelType.name}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {hotelType.code}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {hotelType.description}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    hotelType.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {hotelType.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-center text-sm">
                <button
                  onClick={() => handleEdit(hotelType.id)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                  title="Edit Hotel Type"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(hotelType.id, hotelType.name)}
                  className="text-red-600 hover:text-red-900 font-medium"
                  title="Delete Hotel Type"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
