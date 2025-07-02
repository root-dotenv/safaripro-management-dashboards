// src/pages/room-details-page.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  UserIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  WifiIcon,
  TvIcon,
  SunIcon,
  LockClosedIcon,
  PhoneIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { CoffeeIcon, SnowflakeIcon } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import hotelClient from "../../api/hotel-client";

// Define the Room interface again or import it if shared
interface Room {
  id: string;
  code: string;
  description: string;
  image: string;
  max_occupancy: number;
  price_per_night: number;
  availability_status: string;
  average_rating: number;
  review_count: number;
  room_type_name: string; // Assuming this is available from API for display
  amenities: { id: string; name: string }[]; // Assuming amenities come with name and ID
  // Add other fields you might need from the room API response
}

export default function RoomDetailsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery<Room, Error>({
    queryKey: ["room-details", roomId],
    queryFn: async () => {
      // Use hotelClient for fetching
      const response = await hotelClient.get<Room>(`v1/rooms/${roomId}/`);
      return response.data;
    },
    enabled: !!roomId,
  });

  // Icon mapping for amenities
  const amenityIcons = {
    WiFi: <WifiIcon className="h-5 w-5 text-[#3B82F6]" />, // Example color: Sky Blue
    TV: <TvIcon className="h-5 w-5 text-[#10B981]" />, // Example color: Emerald Green
    "Coffee Maker": <CoffeeIcon className="h-5 w-5 text-[#F59E0B]" />, // Example color: Warm Gold
    "Air Conditioning": <SnowflakeIcon className="h-5 w-5 text-[#3B82F6]" />, // Example color: Sky Blue
    Heating: <SunIcon className="h-5 w-5 text-[#F59E0B]" />, // Example color: Warm Gold
    Safe: <LockClosedIcon className="h-5 w-5 text-[#475569]" />, // Example color: Slate Blue
    Phone: <PhoneIcon className="h-5 w-5 text-[#475569]" />, // Example color: Slate Blue
    "Mini Bar": <ShoppingBagIcon className="h-5 w-5 text-[#EF4444]" />, // Example color: Coral Red
    // Add more mappings as needed, ensure colors align with the amenity icons in HotelAmenities
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155]">
          Loading room details...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEF2F2] text-[#EF4444]">
        <div className="text-lg font-semibold">
          Error loading room details: {error?.message}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-[#FEE2E2] text-[#EF4444] rounded-md hover:bg-[#FCD5D5] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155]">
          Room not found.
        </div>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 bg-[#E0F2FE] text-[#2196F3] rounded-md hover:bg-[#B3E5FC] transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen px-4 py-4 bg-[#F8FAFC]">
      <div className="flex items-center gap-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="h-5 w-5 text-[#646464]" />
        </button>
        <h1 className="text-[1.375rem] text-[#202020] font-bold">
          Room Details: {room.room_type_name} (Code: {room.code})
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image & Description */}
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] border border-[#E8E8E8]">
            <img
              src={room.image}
              alt={room.room_type_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center space-x-2 text-white">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span>
                  {typeof room.average_rating === "number" &&
                  !isNaN(room.average_rating)
                    ? room.average_rating.toFixed(1)
                    : "N/A"}{" "}
                  ({room.review_count || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="text-[#202020]">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-[0.9375rem] leading-relaxed">
              {room.description}
            </p>
          </div>
        </div>

        {/* Right Column - Details & Amenities */}
        <div className="space-y-6">
          {/* Quick Facts */}
          <div className="bg-gray-50 rounded-xl p-5 border border-[#E8E8E8]">
            <h3 className="text-xl font-semibold text-[#334155] mb-4">
              Room Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-[#553ED0] mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7280]">Price</p>
                  <p className="font-medium text-[#202020]">
                    ${room.price_per_night.toFixed(2)}/night
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 text-[#553ED0] mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7280]">Max Occupancy</p>
                  <p className="font-medium text-[#202020]">
                    {room.max_occupancy} guests
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckBadgeIcon className="h-5 w-5 text-[#553ED0] mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7280]">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      room.availability_status === "Available"
                        ? "bg-[#D1FAE5] text-[#059669]"
                        : room.availability_status === "Booked"
                        ? "bg-[#FEF9C3] text-[#F59E0B]"
                        : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}
                  >
                    {room.availability_status}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-[#553ED0] mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7280]">Check-in/out</p>
                  <p className="font-medium text-[#202020]">3PM / 11AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-semibold text-[#334155] mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-[#E8E8E8]"
                  >
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      {amenityIcons[amenity.name] || (
                        <CheckBadgeIcon className="h-5 w-5 text-[#553ED0]" />
                      )}
                    </div>
                    <span className="text-[#202020]">{amenity.name}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-[#6B7280] p-4 bg-gray-50 rounded-lg border border-[#E8E8E8]">
                  No amenities listed for this room.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
