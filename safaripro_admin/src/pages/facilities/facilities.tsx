// src/pages/facilities/facilities.tsx
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { type Facility } from "../../types/facilities";
import {
  FaTrash,
  FaEdit,
  FaCar,
  FaWifi,
  FaSnowflake,
  FaUtensils,
  FaSwimmer,
  FaChild,
  FaCoffee,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Helper to get React Icon component dynamically (expanded for facilities)
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return null;
  switch (iconName.toLowerCase()) {
    case "parking":
    case "car":
      return <FaCar className="text-blue-600" />;
    case "wifi":
      return <FaWifi className="text-indigo-500" />;
    case "snowflake":
      return <FaSnowflake className="text-cyan-500" />;
    case "restaurant":
    case "utensils":
      return <FaUtensils className="text-orange-500" />;
    case "pool":
    case "swimmer":
      return <FaSwimmer className="text-blue-400" />;
    case "kids":
    case "child":
      return <FaChild className="text-green-500" />;
    case "coffee":
      return <FaCoffee className="text-amber-700" />;
    default:
      return null;
  }
};

const queryClient = new QueryClient();

export default function Facilities() {
  const navigate = useNavigate();

  // Fetch all facilities for the initial list
  const {
    data: facilities,
    error,
    isLoading,
    isError,
  } = useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await hotelClient.get("v1/facilities/");
      return response.data.results;
    },
    refetchOnWindowFocus: false,
  });

  // Mutation for Deleting Facility
  const deleteMutation = useMutation({
    mutationFn: async (facilityId: string) => {
      await hotelClient.delete(`v1/facilities/${facilityId}/`);
    },
    onMutate: async (facilityIdToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["facilities"] });

      const previousFacilities = queryClient.getQueryData<Facility[]>([
        "facilities",
      ]);

      queryClient.setQueryData<Facility[]>(["facilities"], (old) =>
        old ? old.filter((facility) => facility.id !== facilityIdToDelete) : []
      );
      return { previousFacilities };
    },
    onSuccess: () => {
      toast.success("Facility deleted successfully!");
    },
    onError: (err, facilityIdToDelete, context) => {
      toast.error(
        `Error deleting facility: ${err.message || "An unknown error occurred"}`
      );
      if (context?.previousFacilities) {
        queryClient.setQueryData<Facility[]>(
          ["facilities"],
          context.previousFacilities
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div className="text-red-600 p-4">Error: {error.message}</div>;
  }

  if (!facilities || facilities.length === 0) {
    return <div className="p-4 text-gray-600">No facilities found.</div>;
  }

  // Handle Delete
  const handleDelete = (facilityId: string, facilityName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the facility "${facilityName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(facilityId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  // Handle Edit
  const handleEdit = (facilityId: string) => {
    navigate(`/facilities/edit/${facilityId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Available Facilities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

// FacilityCard Component
interface FacilityCardProps {
  facility: Facility;
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string) => void;
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  onDelete,
  onEdit,
}) => {
  // Fetch individual facility details for hotel_count
  const { data: detailedFacility, isLoading: isLoadingDetail } =
    useQuery<Facility>({
      queryKey: ["facilityDetail", facility.id],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/facilities/${facility.id}/`);
        return response.data;
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    });

  const hotelCount = detailedFacility?.hotel_count ?? "N/A";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-3">
          {getIconComponent(facility.icon)}
          <h2 className="text-xl font-semibold ml-3 text-gray-900">
            {facility.name}
          </h2>
        </div>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Code:</strong> {facility.code}
        </p>
        <p className="text-gray-700 mb-4">{facility.description}</p>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Hotels with this facility:</strong>{" "}
          {isLoadingDetail ? "Loading..." : hotelCount}
        </p>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Fee Applies:</strong>{" "}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              facility.fee_applies
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {facility.fee_applies ? "Yes" : "No"}
          </span>
        </p>
        <p className="text-gray-600 mb-2">
          <strong className="font-medium">Reservation Required:</strong>{" "}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              facility.reservation_required
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {facility.reservation_required ? "Yes" : "No"}
          </span>
        </p>
        <p className="text-gray-600 mb-4">
          <strong className="font-medium">Available:</strong>{" "}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              facility.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {facility.is_active ? "Yes" : "No"}
          </span>
        </p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(facility.id)}
          className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
          title="Edit Facility"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(facility.id, facility.name)}
          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
          title="Delete Facility"
        >
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};
