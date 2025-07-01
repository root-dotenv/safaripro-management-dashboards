import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { type RoomType } from "../../types/room-types";
import { truncateStr } from "../../utils/truncate";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const queryClient = new QueryClient();

export default function RoomTypes() {
  const navigate = useNavigate();

  const {
    data: room_types,
    error,
    isLoading,
    isError,
  } = useQuery<RoomType[]>({
    queryKey: ["roomTypes"],
    queryFn: async () => {
      const response = await hotelClient.get("v1/room-types/");
      return response.data.results;
    },
    refetchOnWindowFocus: false,
  });

  // * - - - Mutation for Deleting Room Type
  const deleteMutation = useMutation({
    mutationFn: async (roomTypeId: string) => {
      await hotelClient.delete(`v1/room-types/${roomTypeId}/`);
    },
    onMutate: async (roomTypeIdToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["roomTypes"] });

      const previousRoomTypes = queryClient.getQueryData<RoomType[]>([
        "roomTypes",
      ]);

      queryClient.setQueryData<RoomType[]>(["roomTypes"], (old) =>
        old ? old.filter((roomType) => roomType.id !== roomTypeIdToDelete) : []
      );

      return { previousRoomTypes };
    },
    onSuccess: () => {
      toast.success("Room Type deleted successfully!");
    },
    onError: (err, roomTypeIdToDelete, context) => {
      toast.error(
        `Error deleting room type: ${
          err.message || "An unknown error occurred"
        }`
      );
      if (context?.previousRoomTypes) {
        queryClient.setQueryData<RoomType[]>(
          ["roomTypes"],
          context.previousRoomTypes
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
    },
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!room_types || room_types.length === 0) {
    return <div>No room types found.</div>;
  }

  console.log(`Room Types:`, room_types);

  // * - - - Actions Handlers
  const handleDelete = (roomTypeId: string, roomTypeName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the room type "${roomTypeName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(roomTypeId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  const handleEdit = (roomTypeId: string) => {
    navigate(`/rooms/edit/${roomTypeId}`);
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
              Image
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Capacity
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Available Rooms
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Base Price
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Area (SQM)
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-left text-xs font-medium text-[#202020] uppercase tracking-wider"
            >
              Bed Type
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
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {room_types.map((roomType, index) => (
            <tr key={roomType.id} className="hover:bg-gray-50">
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {index + 1}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.name}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.image ? (
                  <img
                    src={roomType.image}
                    alt={roomType.name}
                    className="h-10 w-10 object-cover rounded-full"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.max_occupancy}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.room_availability}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                ${roomType.base_price}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.size_sqm !== null
                  ? `${roomType.size_sqm} sqm`
                  : "N/A"}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {roomType.bed_type}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                {truncateStr(roomType.description, 13)}
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-sm text-[#202020]">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    roomType.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {roomType.is_active ? "Active" : "Not Active"}
                </span>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-center text-sm">
                <button
                  onClick={() => handleEdit(roomType.id)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                  title="Edit Room Type"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(roomType.id, roomType.name)}
                  className="text-red-600 hover:text-red-900 font-medium"
                  title="Delete Room Type"
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
