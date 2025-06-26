// HotelDetails.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import type { Hotel } from "../../types/hotel-types"; // Import the Hotel interface

export default function HotelDetails() {
  const { hotel_id } = useParams<{ hotel_id: string }>();

  const {
    data: hotelDetails,
    isLoading,
    isError,
    error,
  } = useQuery<Hotel>({
    queryKey: ["hotelDetails", hotel_id],
    queryFn: async () => {
      const response = await hotelClient.get(`v1/hotels/${hotel_id}/`); // Fetch single hotel details
      return response.data;
    },
    enabled: !!hotel_id, // Only run the query if hotel_id is available
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError) {
    return <div>Error loading hotel details: {error?.message}</div>;
  }

  if (!hotelDetails) {
    return <div>No hotel details found for ID: {hotel_id}</div>;
  }

  console.log("Detailed Hotel Data:", hotelDetails);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Hotel Details: {hotelDetails.name}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <p>
            <strong className="font-medium">Hotel ID:</strong> {hotelDetails.id}
          </p>
          <p>
            <strong className="font-medium">Name:</strong> {hotelDetails.name}
          </p>
          <p>
            <strong className="font-medium">Code:</strong> {hotelDetails.code}
          </p>
          <p>
            <strong className="font-medium">Star Rating:</strong>{" "}
            {hotelDetails.star_rating}
          </p>
          <p className="md:col-span-2">
            <strong className="font-medium">Description:</strong>{" "}
            {hotelDetails.description}
          </p>
          <p>
            <strong className="font-medium">Address:</strong>{" "}
            {hotelDetails.address}, {hotelDetails.zip_code}
          </p>
          <p>
            <strong className="font-medium">Destination:</strong>{" "}
            {hotelDetails.destination}
          </p>
          <p>
            <strong className="font-medium">Latitude:</strong>{" "}
            {hotelDetails.latitude}
          </p>
          <p>
            <strong className="font-medium">Longitude:</strong>{" "}
            {hotelDetails.longitude}
          </p>
          <p>
            <strong className="font-medium">Active:</strong>{" "}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                hotelDetails.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {hotelDetails.is_active ? "Yes" : "No"}
            </span>
          </p>
          <p>
            <strong className="font-medium">Created At:</strong>{" "}
            {new Date(hotelDetails.created_at).toLocaleString()}
          </p>
          <p>
            <strong className="font-medium">Updated At:</strong>{" "}
            {new Date(hotelDetails.updated_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Room & Pricing Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <p>
            <strong className="font-medium">Total Rooms:</strong>{" "}
            {hotelDetails.number_rooms}
          </p>
          <p>
            <strong className="font-medium">Occupancy Rate:</strong>{" "}
            {hotelDetails.occupancy_rate}%
          </p>
          <p>
            <strong className="font-medium">Average Room Price:</strong> $
            {hotelDetails.average_room_price?.toFixed(2)}
          </p>
          <p>
            <strong className="font-medium">Discount:</strong>{" "}
            {hotelDetails.discount}%
          </p>
          <p>
            <strong className="font-medium">Check-in From:</strong>{" "}
            {hotelDetails.check_in_from}
          </p>
          <p>
            <strong className="font-medium">Check-out To:</strong>{" "}
            {hotelDetails.check_out_to}
          </p>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Room Types Available:
          </h3>
          {hotelDetails.room_type && hotelDetails.room_type.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {hotelDetails.room_type.map((roomType) => (
                <li key={roomType.id}>
                  {roomType.name} (Code: {roomType.code}) - Max Occupancy:{" "}
                  {roomType.max_occupancy} | Bed Type: {roomType.bed_type} |
                  Available: {roomType.availability.available_rooms}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No room types listed.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Additional Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800">
          <p>
            <strong className="font-medium">Number of Floors:</strong>{" "}
            {hotelDetails.number_floors}
          </p>
          <p>
            <strong className="font-medium">Restaurants:</strong>{" "}
            {hotelDetails.number_restaurants}
          </p>
          <p>
            <strong className="font-medium">Bars:</strong>{" "}
            {hotelDetails.number_bars}
          </p>
          <p>
            <strong className="font-medium">Year Built:</strong>{" "}
            {hotelDetails.year_built}
          </p>
          <p>
            <strong className="font-medium">Activities:</strong>{" "}
            {hotelDetails.number_activities}
          </p>
          <p>
            <strong className="font-medium">Rate Options:</strong>{" "}
            {hotelDetails.rate_options}
          </p>
          <p className="col-span-1 md:col-span-2 lg:col-span-3">
            <strong className="font-medium">Website:</strong>{" "}
            {hotelDetails.website_url ? (
              <a
                href={hotelDetails.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {hotelDetails.website_url}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          {/* Social Media Links (if present) */}
          {hotelDetails.facebook_url && (
            <p>
              <strong className="font-medium">Facebook:</strong>{" "}
              <a
                href={hotelDetails.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link
              </a>
            </p>
          )}
          {hotelDetails.instagram_url && (
            <p>
              <strong className="font-medium">Instagram:</strong>{" "}
              <a
                href={hotelDetails.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link
              </a>
            </p>
          )}
          {hotelDetails.twitter_url && (
            <p>
              <strong className="font-medium">Twitter:</strong>{" "}
              <a
                href={hotelDetails.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link
              </a>
            </p>
          )}
          {hotelDetails.youtube_url && (
            <p>
              <strong className="font-medium">YouTube:</strong>{" "}
              <a
                href={hotelDetails.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link
              </a>
            </p>
          )}
          {hotelDetails.Maps_url && (
            <p>
              <strong className="font-medium">Google Maps:</strong>{" "}
              <a
                href={hotelDetails.Maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Link
              </a>
            </p>
          )}
        </div>

        {/* Displaying IDs for related entities as requested */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Related IDs (Raw)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800">
            <p>
              <strong className="font-medium">Image IDs:</strong>{" "}
              {hotelDetails.image_ids.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Regions IDs:</strong>{" "}
              {hotelDetails.regions.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Themes IDs:</strong>{" "}
              {hotelDetails.themes.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Meal Types IDs:</strong>{" "}
              {hotelDetails.meal_types.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Amenities IDs:</strong>{" "}
              {hotelDetails.amenities.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Services IDs:</strong>{" "}
              {hotelDetails.services.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Facilities IDs:</strong>{" "}
              {hotelDetails.facilities.join(", ") || "N/A"}
            </p>
            {/* Add other ID lists as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
