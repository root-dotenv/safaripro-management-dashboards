// hotel-details.tsx
import { useParams } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import type {
  Hotel,
  HotelImage,
  Region,
  Theme,
  MealType,
} from "../../types/hotel-types"; // Import all necessary interfaces
import type { Amenity } from "../../types/amenities"; // Import Amenity
import type { Facility } from "../../types/facilities"; // Import Facility
import {
  FaWifi,
  FaCoffee,
  FaSnowflake,
  FaTv,
  FaLock,
  FaDesktop,
  FaBed, // Amenities icons
  FaCar,
  FaUtensils,
  FaSwimmer,
  FaChild, // Facilities icons
} from "react-icons/fa"; // Import icons

// Helper to get React Icon component dynamically
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return null;
  switch (iconName.toLowerCase()) {
    case "wifi":
      return <FaWifi className="text-blue-500 mr-2" />;
    case "coffee":
      return <FaCoffee className="text-brown-500 mr-2" />;
    case "snowflake":
      return <FaSnowflake className="text-teal-500 mr-2" />;
    case "tv":
      return <FaTv className="text-gray-700 mr-2" />;
    case "lock":
      return <FaLock className="text-gray-600 mr-2" />;
    case "desktop":
      return <FaDesktop className="text-indigo-600 mr-2" />;
    case "bed":
      return <FaBed className="text-purple-600 mr-2" />;
    case "parking":
    case "car":
      return <FaCar className="text-blue-600 mr-2" />;
    case "restaurant":
    case "utensils":
      return <FaUtensils className="text-orange-500 mr-2" />;
    case "pool":
    case "swimmer":
      return <FaSwimmer className="text-blue-400 mr-2" />;
    case "kids":
    case "child":
      return <FaChild className="text-green-500 mr-2" />;
    default:
      return null;
  }
};

export default function HotelDetails() {
  const { hotel_id } = useParams<{ hotel_id: string }>();

  // 1. Fetch main hotel details
  const {
    data: hotelDetails,
    isLoading: isLoadingHotel,
    isError: isErrorHotel,
    error: hotelError,
    isSuccess: isHotelDetailsSuccess, // Track success of hotelDetails fetch
  } = useQuery<Hotel>({
    queryKey: ["hotelDetails", hotel_id],
    queryFn: async () => {
      const response = await hotelClient.get(`v1/hotels/${hotel_id}/`); // Fetch hotel details
      return response.data;
    },
    enabled: !!hotel_id, // Enabled when hotel_id is available
    refetchOnWindowFocus: false,
  });

  // 2. Fetch image details, dependent on hotelDetails
  const imageQueries = useQueries({
    queries: (hotelDetails?.image_ids || []).map((imageId) => ({
      queryKey: ["hotelImage", imageId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/hotel-images/${imageId}/`); // Fetch image details
        return response.data as HotelImage;
      },
      enabled: isHotelDetailsSuccess, // Enabled only when hotelDetails is successfully loaded
      refetchOnWindowFocus: false,
    })),
  });

  const areAllImagesSuccessful = imageQueries.every((query) => query.isSuccess);

  // 3. Fetch region details, dependent on hotelDetails AND images being successful
  const regionQueries = useQueries({
    queries: (hotelDetails?.regions || []).map((regionId) => ({
      queryKey: ["region", regionId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/regions/${regionId}/`); // Fetch region details
        return response.data as Region;
      },
      enabled: isHotelDetailsSuccess && areAllImagesSuccessful, // Enabled only when hotelDetails and ALL images are successful
      refetchOnWindowFocus: false,
    })),
  });

  const areAllRegionsSuccessful = regionQueries.every(
    (query) => query.isSuccess
  );

  // 4. Fetch themes details, dependent on hotelDetails and images and regions being successful
  const themeQueries = useQueries({
    queries: (hotelDetails?.themes || []).map((themeId) => ({
      queryKey: ["theme", themeId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/themes/${themeId}/`);
        return response.data as Theme;
      },
      enabled:
        isHotelDetailsSuccess &&
        areAllImagesSuccessful &&
        areAllRegionsSuccessful,
      refetchOnWindowFocus: false,
    })),
  });

  const areAllThemesSuccessful = themeQueries.every((query) => query.isSuccess);

  // 5. Fetch meal types details, dependent on hotelDetails, images, regions, and themes being successful
  const mealTypeQueries = useQueries({
    queries: (hotelDetails?.meal_types || []).map((mealTypeId) => ({
      queryKey: ["mealType", mealTypeId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/meal-types/${mealTypeId}/`);
        return response.data as MealType;
      },
      enabled:
        isHotelDetailsSuccess &&
        areAllImagesSuccessful &&
        areAllRegionsSuccessful &&
        areAllThemesSuccessful,
      refetchOnWindowFocus: false,
    })),
  });

  const areAllMealTypesSuccessful = mealTypeQueries.every(
    (query) => query.isSuccess
  );

  // 6. Fetch amenities details, dependent on previous successful fetches
  const amenityQueries = useQueries({
    queries: (hotelDetails?.amenities || []).map((amenityId) => ({
      queryKey: ["amenityDetail", amenityId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/amenities/${amenityId}/`);
        return response.data as Amenity;
      },
      enabled:
        isHotelDetailsSuccess &&
        areAllImagesSuccessful &&
        areAllRegionsSuccessful &&
        areAllThemesSuccessful &&
        areAllMealTypesSuccessful,
      refetchOnWindowFocus: false,
    })),
  });

  const areAllAmenitiesSuccessful = amenityQueries.every(
    (query) => query.isSuccess
  );

  // 7. Fetch facilities details, dependent on all previous queries being successful
  const facilityQueries = useQueries({
    queries: (hotelDetails?.facilities || []).map((facilityId) => ({
      queryKey: ["facilityDetail", facilityId],
      queryFn: async () => {
        const response = await hotelClient.get(`v1/facilities/${facilityId}/`);
        return response.data as Facility;
      },
      enabled:
        isHotelDetailsSuccess &&
        areAllImagesSuccessful &&
        areAllRegionsSuccessful &&
        areAllThemesSuccessful &&
        areAllMealTypesSuccessful &&
        areAllAmenitiesSuccessful, // Dependent on ALL previous successful fetches
      refetchOnWindowFocus: false,
    })),
  });

  // Consolidate loading states
  const isLoadingImages = imageQueries.some((query) => query.isLoading);
  const isLoadingRegions = regionQueries.some((query) => query.isLoading);
  const isLoadingThemes = themeQueries.some((query) => query.isLoading);
  const isLoadingMealTypes = mealTypeQueries.some((query) => query.isLoading);
  const isLoadingAmenities = amenityQueries.some((query) => query.isLoading);
  const isLoadingFacilities = facilityQueries.some((query) => query.isLoading);

  if (
    isLoadingHotel ||
    isLoadingImages ||
    isLoadingRegions ||
    isLoadingThemes ||
    isLoadingMealTypes ||
    isLoadingAmenities ||
    isLoadingFacilities
  ) {
    return <CustomLoader />;
  }

  // Consolidate error states
  if (isErrorHotel) {
    return <div>Error loading hotel details: {hotelError?.message}</div>;
  }

  const isErrorImages = imageQueries.some((query) => query.isError);
  const isErrorRegions = regionQueries.some((query) => query.isError);
  const isErrorThemes = themeQueries.some((query) => query.isError);
  const isErrorMealTypes = mealTypeQueries.some((query) => query.isError);
  const isErrorAmenities = amenityQueries.some((query) => query.isError);
  const isErrorFacilities = facilityQueries.some((query) => query.isError);

  if (isErrorImages) {
    return <div>Error loading some hotel images.</div>; // Provide more specific messages if needed
  }
  if (isErrorRegions) {
    return <div>Error loading some region details.</div>;
  }
  if (isErrorThemes) {
    return <div>Error loading some theme details.</div>;
  }
  if (isErrorMealTypes) {
    return <div>Error loading some meal type details.</div>;
  }
  if (isErrorAmenities) {
    return <div>Error loading some amenity details.</div>;
  }
  if (isErrorFacilities) {
    return <div>Error loading some facility details.</div>;
  }

  if (!hotelDetails) {
    return <div>No hotel details found for ID: {hotel_id}</div>;
  }

  // Extract actual data from useQueries results for rendering
  const images = imageQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as HotelImage);

  const regions = regionQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as Region);

  const themes = themeQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as Theme);

  const mealTypes = mealTypeQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as MealType);

  const amenities = amenityQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as Amenity);

  const facilities = facilityQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data as Facility);

  console.log("Detailed Hotel Data:", hotelDetails);
  console.log("Fetched Images Data:", images);
  console.log("Fetched Regions Data:", regions);
  console.log("Fetched Themes Data:", themes);
  console.log("Fetched Meal Types Data:", mealTypes);
  console.log("Fetched Amenities Data:", amenities);
  console.log("Fetched Facilities Data:", facilities);

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

        {/* Displaying Images */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">Images:</h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={image.original}
                    alt={image.hotel_name || "Hotel Image"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 text-white text-xs">
                    <p className="font-medium">
                      {image.tag || image.category_name}
                    </p>
                    <p>{image.image_type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No images available.</p>
          )}
        </div>

        {/* Displaying Regions */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">Regions:</h3>
          {regions.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {regions.map((region) => (
                <li key={region.id}>
                  {region.name} ({region.kind}) in {region.country_name} (
                  {region.hotel_count} hotels)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No regions listed.</p>
          )}
        </div>

        {/* Displaying Themes */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">Themes:</h3>
          {themes.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {themes.map((theme) => (
                <li key={theme.id}>
                  {theme.name}: {theme.description} ({theme.hotel_count} hotels)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No themes listed.</p>
          )}
        </div>

        {/* Displaying Meal Types */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Meal Types:
          </h3>
          {mealTypes.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {mealTypes.map((mealType) => (
                <li key={mealType.id}>
                  {mealType.name} ({mealType.code}) - {mealType.description} (
                  {mealType.hotel_count} hotels)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No meal types listed.</p>
          )}
        </div>

        {/* Displaying Amenities */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">Amenities:</h3>
          {amenities.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {amenities.map((amenity) => (
                <li key={amenity.id} className="flex items-center">
                  {getIconComponent(amenity.icon)}
                  {amenity.name}: {amenity.description} (Usage:{" "}
                  {amenity.usage_count || "N/A"})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No amenities listed.</p>
          )}
        </div>

        {/* Displaying Facilities */}
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Facilities:
          </h3>
          {facilities.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {facilities.map((facility) => (
                <li key={facility.id} className="flex items-center">
                  {getIconComponent(facility.icon)}
                  {facility.name}: {facility.description} (Hotels:{" "}
                  {facility.hotel_count || "N/A"})
                  {facility.fee_applies && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                      Fee Applies
                    </span>
                  )}
                  {facility.reservation_required && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                      Reservation Req.
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No facilities listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
