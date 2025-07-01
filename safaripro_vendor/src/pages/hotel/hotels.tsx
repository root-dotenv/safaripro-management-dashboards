// hotels.tsx
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { useState } from "react";
import type { PaginatedHotelsResponse } from "../../types/hotel-types";  
import { FaEye, FaTrash } from "react-icons/fa";  
import { useNavigate } from "react-router-dom";  
import { toast } from "react-toastify";  
import Swal from "sweetalert2"; 

const queryClient = new QueryClient();  

export default function Hotels() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();

  const {
    data: hotelsResponse,
    isLoading,
    error,
    isError,
  } = useQuery<PaginatedHotelsResponse>({
    queryKey: ["hotels", page, limit],
    queryFn: async () => {
      const response = await hotelClient.get(
        `v1/hotels?page=${page}&limit=${limit}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const hotels = hotelsResponse?.results;
  const hasNextPage = hotelsResponse?.next !== null;
  const hasPreviousPage = hotelsResponse?.previous !== null;

  // * - - - Mutation for Deleting Hotel
  const deleteMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      await hotelClient.delete(`v1/hotels/${hotelId}/`);
    },
    onMutate: async (hotelIdToDelete: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["hotels", page, limit] });

      // Snapshot the previous value
      const previousHotels = queryClient.getQueryData<PaginatedHotelsResponse>([
        "hotels",
        page,
        limit,
      ]);

      // Optimistically update the list by removing the deleted hotel
      queryClient.setQueryData<PaginatedHotelsResponse>(
        ["hotels", page, limit],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.filter(
              (hotel) => hotel.id !== hotelIdToDelete
            ),
            count: old.count - 1, // Decrement total count optimistically
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousHotels };
    },
    onSuccess: () => {
      toast.success("Hotel deleted successfully!");
    },
    onError: (err, hotelIdToDelete, context) => {
      toast.error(
        `Error deleting hotel: ${err.message || "An unknown error occurred"}`
      );
      // Rollback to the previous data if the mutation fails
      if (context?.previousHotels) {
        queryClient.setQueryData<PaginatedHotelsResponse>(
          ["hotels", page, limit],
          context.previousHotels
        );
      }
    },
    onSettled: () => {
      // Invalidate and refetch after error or success to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <p>Error loading hotels: {error?.message}</p>;
  }

  if (!hotels || hotels.length === 0) {
    return <div>No hotels found.</div>;
  }

  console.log("Hotels data:", hotels);

  // - - - Pagination Handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setPage((prevPage) => Math.max(1, prevPage - 1));
    }
  };

  // - - - Handle View Details
  const handleViewDetails = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`); // Redirect to HotelDetails page
  };

  // - - - Handle Delete Hotel
  const handleDeleteHotel = (hotelId: string, hotelName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the hotel "${hotelName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(hotelId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  return (
    <div className="p-6 text-[0.875rem]">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#E5E6FF]">
          <tr>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              S/N
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Code
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Star Rating
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Address
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Rooms
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Occupancy Rate
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Avg. Room Price
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Discount
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-2 py-1 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hotels.map((hotel, index) => (
            <tr key={hotel.id} className="hover:bg-gray-50">
              <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                {(page - 1) * limit + index + 1}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.name}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.code}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.star_rating}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.address}, {hotel.zip_code}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.number_rooms}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.occupancy_rate}%
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                ${hotel.average_room_price?.toFixed(2)}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                {hotel.discount}%
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-sm text-[#202020]">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    hotel.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {hotel.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-center text-sm text-[#202020]">
                <button
                  onClick={() => handleViewDetails(hotel.id)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium mr-2" // Added mr-2 for spacing
                  title="View Hotel Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDeleteHotel(hotel.id, hotel.name)} // Pass hotel name for confirmation
                  className="text-red-600 hover:text-red-900 font-medium"
                  title="Delete Hotel"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
