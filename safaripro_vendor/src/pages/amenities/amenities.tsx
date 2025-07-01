// src/pages/amenities/amenities.tsx
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { type Amenity } from "../../types/amenities";
import {
  FaTrash,
  FaEdit,
  FaWifi,
  FaCoffee,
  FaSnowflake,
  FaTv,
  FaLock,
  FaDesktop,
  FaBed,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// - - - Helper to get React Icon component dynamically
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case "wifi":
      return <FaWifi className="text-blue-500" />;
    case "coffee":
      return <FaCoffee className="text-brown-500" />;
    case "snowflake":
      return <FaSnowflake className="text-teal-500" />;
    case "tv":
      return <FaTv className="text-gray-700" />;
    case "lock":
      return <FaLock className="text-gray-600" />;
    case "desktop":
      return <FaDesktop className="text-indigo-600" />;
    case "bed":
      return <FaBed className="text-purple-600" />;
    default:
      return null;
  }
};

const queryClient = new QueryClient();

export default function Amenities() {
  const navigate = useNavigate();

  const {
    data: amenities,
    error,
    isLoading,
    isError,
  } = useQuery<Amenity[]>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await hotelClient.get("v1/amenities/");
      return response.data.results;
    },
    refetchOnWindowFocus: false,
  });

  // - - - Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (amenityId: string) => {
      await hotelClient.delete(`v1/amenities/${amenityId}/`);
    },
    onMutate: async (amenityIdToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["amenities"] });

      const previousAmenities = queryClient.getQueryData<Amenity[]>([
        "amenities",
      ]);

      queryClient.setQueryData<Amenity[]>(["amenities"], (old) =>
        old ? old.filter((amenity) => amenity.id !== amenityIdToDelete) : []
      );
      return { previousAmenities };
    },
    onSuccess: () => {
      toast.success("Amenity deleted successfully!");
    },
    onError: (err, amenityIdToDelete, context) => {
      toast.error(
        `Error deleting amenity: ${err.message || "An unknown error occurred"}`
      );
      if (context?.previousAmenities) {
        queryClient.setQueryData<Amenity[]>(
          ["amenities"],
          context.previousAmenities
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div className="text-red-600 p-4">Error: {error.message}</div>;
  }

  if (!amenities || amenities.length === 0) {
    return <div className="p-4 text-gray-600">No amenities found.</div>;
  }

  // - - -   Delete Handler
  const handleDelete = (amenityId: string, amenityName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the amenity "${amenityName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(amenityId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  //  - - - Edit Handler
  const handleEdit = (amenityId: string) => {
    navigate(`/amenities/edit/${amenityId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Available Amenities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            amenity={amenity}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

// - - - AmenityCard Component
interface AmenityCardProps {
  amenity: Amenity;
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string) => void;
}

const AmenityCard: React.FC<AmenityCardProps> = ({
  amenity,
  onDelete,
  onEdit,
}) => {
  // - - - Fetch individual amenity details for usage_count
  const { data: detailedAmenity, isLoading: isLoadingDetail } =
    useQuery<Amenity>({
      queryKey: ["amenityDetail", amenity.id],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/amenities/${amenity.id}/`);
        return response.data;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    });

  const usageCount = detailedAmenity?.usage_count ?? "N/A";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          {getIconComponent(amenity.icon)}
          <h2 className="text-xl font-semibold ml-3 text-gray-900">
            {amenity.name}
          </h2>
        </div>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Code:</strong> {amenity.code}
        </p>
        <p className="text-gray-700 mb-4">{amenity.description}</p>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Usage Count:</strong>{" "}
          {isLoadingDetail ? "Loading..." : usageCount}
        </p>
        <p className="text-gray-600 mb-4">
          <strong className="font-medium">Available:</strong>{" "}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              amenity.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {amenity.is_active ? "Yes" : "No"}
          </span>
        </p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(amenity.id)}
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
          title="Edit Amenity"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(amenity.id, amenity.name)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
          title="Delete Amenity"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};
