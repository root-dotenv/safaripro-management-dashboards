import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import CustomLoader from "../../components/ui/custom-loader";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Import types for dropdowns
import type { Amenity } from "../../types/amenities";
import type { Facility } from "../../types/facilities";
import type {
  HotelType,
  Region,
  Theme,
  MealType,
  Country,
  Service,
  Translation,
} from "../../types/hotel-types";

// Define the shape of the form data for validation and submission
interface NewHotelFormData {
  name: string;
  code: string;
  country: string; // ID
  hotel_type: string; // ID
  number_rooms: number;
  number_floors: number;
  number_restaurants: number;
  number_bars: number;
  number_parks: number;
  number_halls: number;
  year_built: number;
  address: string;
  star_rating: number;
  description: string;
  zip_code: string;
  latitude: string; // Keep as string for decimal handling
  longitude: string; // Keep as string for decimal handling
  regions: string[]; // Array of IDs
  themes: string[]; // Array of IDs
  meal_types: string[]; // Array of IDs
  amenities: string[]; // Array of IDs
  services: string[]; // Array of IDs
  facilities: string[]; // Array of IDs
  translations: string[]; // Array of IDs
  // Note: image_ids, staff_ids, promotion_ids, etc., are not in the creation payload
}

// Define validation schema using Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Hotel name is required")
    .min(3, "Name must be at least 3 characters"),
  code: yup
    .string()
    .required("Code is required")
    .min(2, "Code must be at least 2 characters"),
  country: yup.string().required("Country is required"),
  hotel_type: yup.string().required("Hotel Type is required"),
  number_rooms: yup
    .number()
    .integer("Must be an integer")
    .min(1, "Must have at least 1 room")
    .required("Number of rooms is required"),
  number_floors: yup
    .number()
    .integer("Must be an integer")
    .min(1, "Must have at least 1 floor")
    .required("Number of floors is required"),
  number_restaurants: yup
    .number()
    .integer("Must be an integer")
    .min(0, "Cannot be negative")
    .required("Number of restaurants is required"),
  number_bars: yup
    .number()
    .integer("Must be an integer")
    .min(0, "Cannot be negative")
    .required("Number of bars is required"),
  number_parks: yup
    .number()
    .integer("Must be an integer")
    .min(0, "Cannot be negative")
    .required("Number of parks is required"),
  number_halls: yup
    .number()
    .integer("Must be an integer")
    .min(0, "Cannot be negative")
    .required("Number of halls is required"),
  year_built: yup
    .number()
    .integer("Must be an integer")
    .min(1800, "Year built seems too old")
    .max(new Date().getFullYear(), "Cannot be in the future")
    .required("Year built is required"),
  address: yup.string().required("Address is required"),
  star_rating: yup
    .number()
    .integer("Must be an integer")
    .min(1, "Min 1 star")
    .max(5, "Max 5 stars")
    .required("Star rating is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  zip_code: yup.string().required("Zip code is required"),
  latitude: yup
    .string()
    .required("Latitude is required")
    .matches(
      /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/,
      "Invalid Latitude format (e.g., -12.345)"
    ), // Basic regex for latitude
  longitude: yup
    .string()
    .required("Longitude is required")
    .matches(
      /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/,
      "Invalid Longitude format (e.g., 34.567)"
    ), // Basic regex for longitude
  regions: yup
    .array()
    .of(yup.string())
    .min(1, "At least one region is required")
    .required("Regions are required"),
  themes: yup
    .array()
    .of(yup.string())
    .min(1, "At least one theme is required")
    .required("Themes are required"),
  meal_types: yup
    .array()
    .of(yup.string())
    .min(1, "At least one meal type is required")
    .required("Meal types are required"),
  amenities: yup
    .array()
    .of(yup.string())
    .min(1, "At least one amenity is required")
    .required("Amenities are required"),
  services: yup
    .array()
    .of(yup.string())
    .min(1, "At least one service is required")
    .required("Services are required"),
  facilities: yup
    .array()
    .of(yup.string())
    .min(1, "At least one facility is required")
    .required("Facilities are required"),
  translations: yup
    .array()
    .of(yup.string())
    .min(1, "At least one translation is required")
    .required("Translations are required"),
});

export default function NewHotel() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewHotelFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      country: "",
      hotel_type: "",
      number_rooms: 1,
      number_floors: 1,
      number_restaurants: 0,
      number_bars: 0,
      number_parks: 0,
      number_halls: 0,
      year_built: new Date().getFullYear(),
      address: "",
      star_rating: 3,
      description: "",
      zip_code: "",
      latitude: "",
      longitude: "",
      regions: [],
      themes: [],
      meal_types: [],
      amenities: [],
      services: [],
      facilities: [],
      translations: [],
    },
  });

  const watchFields = watch(); // Watch all fields for live preview

  // Fetch data for dropdowns
  const { data: regionsData, isLoading: isLoadingRegions } = useQuery<Region[]>(
    {
      queryKey: ["regions"],
      queryFn: async () => (await hotelClient.get("v1/regions/")).data.results,
      refetchOnWindowFocus: false,
    }
  );

  const { data: themesData, isLoading: isLoadingThemes } = useQuery<Theme[]>({
    queryKey: ["themes"],
    queryFn: async () => (await hotelClient.get("v1/themes/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: mealTypesData, isLoading: isLoadingMealTypes } = useQuery<
    MealType[]
  >({
    queryKey: ["mealTypes"],
    queryFn: async () => (await hotelClient.get("v1/meal-types/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery<
    Amenity[]
  >({
    queryKey: ["amenities"],
    queryFn: async () => (await hotelClient.get("v1/amenities/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: facilitiesData, isLoading: isLoadingFacilities } = useQuery<
    Facility[]
  >({
    queryKey: ["facilities"],
    queryFn: async () => (await hotelClient.get("v1/facilities/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: servicesData, isLoading: isLoadingServices } = useQuery<
    Service[]
  >({
    queryKey: ["services"],
    queryFn: async () => (await hotelClient.get("v1/services/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: translationsData, isLoading: isLoadingTranslations } = useQuery<
    Translation[]
  >({
    queryKey: ["translations"],
    queryFn: async () =>
      (await hotelClient.get("v1/translations/")).data.results,
    refetchOnWindowFocus: false,
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["countries"],
    queryFn: async () => {
      // Assuming a /v1/countries/ endpoint exists. If not, you might derive from regions or mock.
      // For now, I'll use a placeholder for countries if the endpoint doesn't return data.
      try {
        const response = await hotelClient.get("v1/countries/");
        return response.data.results;
      } catch (e) {
        console.warn(
          "Countries endpoint not found or failed, using mock data.",
          e
        );
        return [
          { id: "mock-country-id-1", name: "Tanzania" },
          { id: "mock-country-id-2", name: "Kenya" },
        ] as Country[];
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: hotelTypesData, isLoading: isLoadingHotelTypes } = useQuery<
    HotelType[]
  >({
    queryKey: ["hotelTypes"],
    queryFn: async () =>
      (await hotelClient.get("v1/hotel-types/")).data.results,
    refetchOnWindowFocus: false,
  });

  // Mutation for Creating New Hotel
  const createHotelMutation = useMutation({
    mutationFn: async (newHotelData: NewHotelFormData) => {
      // Ensure numerical fields are numbers and latitude/longitude are strings
      const payload = {
        ...newHotelData,
        number_rooms: Number(newHotelData.number_rooms),
        number_floors: Number(newHotelData.number_floors),
        number_restaurants: Number(newHotelData.number_restaurants),
        number_bars: Number(newHotelData.number_bars),
        number_parks: Number(newHotelData.number_parks),
        number_halls: Number(newHotelData.number_halls),
        year_built: Number(newHotelData.year_built),
        star_rating: Number(newHotelData.star_rating),
        latitude: String(newHotelData.latitude), // Ensure string
        longitude: String(newHotelData.longitude), // Ensure string
      };

      console.log("Submitting Hotel Payload:", payload); // Debugging: Console the form data object

      const response = await hotelClient.post("v1/hotels/", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Hotel created successfully!");
      navigate("/hotels/all-hotels"); // Redirect back to the hotels list
    },
    onError: (err: any) => {
      console.error("Error creating hotel:", err);
      toast.error(
        `Error creating hotel: ${
          err.response?.data?.detail ||
          err.message ||
          "An unknown error occurred"
        }`
      );
    },
  });

  const onSubmit = (data: NewHotelFormData) => {
    createHotelMutation.mutate(data);
  };

  // Check if all necessary dropdown data is loading
  const isLoadingDropdowns =
    isLoadingRegions ||
    isLoadingThemes ||
    isLoadingMealTypes ||
    isLoadingAmenities ||
    isLoadingFacilities ||
    isLoadingServices ||
    isLoadingTranslations ||
    isLoadingCountries ||
    isLoadingHotelTypes;

  if (isLoadingDropdowns) {
    return <CustomLoader />;
  }

  // Handle errors for dropdowns
  if (
    !regionsData ||
    !themesData ||
    !mealTypesData ||
    !amenitiesData ||
    !facilitiesData ||
    !servicesData ||
    !translationsData ||
    !countriesData ||
    !hotelTypesData
  ) {
    return (
      <div className="p-4 text-red-600">
        Error loading necessary data for dropdowns.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Hotel
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8"
      >
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="country"
                {...register("country")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a Country</option>
                {countriesData.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="hotel_type"
                className="block text-sm font-medium text-gray-700"
              >
                Hotel Type
              </label>
              <select
                id="hotel_type"
                {...register("hotel_type")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select a Hotel Type</option>
                {hotelTypesData.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.hotel_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hotel_type.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="star_rating"
                className="block text-sm font-medium text-gray-700"
              >
                Star Rating
              </label>
              <input
                type="number"
                id="star_rating"
                {...register("star_rating")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
                max="5"
              />
              {errors.star_rating && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.star_rating.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="year_built"
                className="block text-sm font-medium text-gray-700"
              >
                Year Built
              </label>
              <input
                type="number"
                id="year_built"
                {...register("year_built")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1800"
                max={new Date().getFullYear().toString()}
              />
              {errors.year_built && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.year_built.message}
                </p>
              )}
            </div>
            <div className="lg:col-span-3">
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Location & Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="zip_code"
                className="block text-sm font-medium text-gray-700"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zip_code"
                {...register("zip_code")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.zip_code && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.zip_code.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <input
                type="text"
                id="latitude"
                {...register("latitude")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="-6.175"
              />
              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.latitude.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                {...register("longitude")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="35.75"
              />
              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Counts & Capacities */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Counts & Capacities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="number_rooms"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Rooms
              </label>
              <input
                type="number"
                id="number_rooms"
                {...register("number_rooms")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
              />
              {errors.number_rooms && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_rooms.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="number_floors"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Floors
              </label>
              <input
                type="number"
                id="number_floors"
                {...register("number_floors")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="1"
              />
              {errors.number_floors && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_floors.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="number_restaurants"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Restaurants
              </label>
              <input
                type="number"
                id="number_restaurants"
                {...register("number_restaurants")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
              />
              {errors.number_restaurants && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_restaurants.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="number_bars"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Bars
              </label>
              <input
                type="number"
                id="number_bars"
                {...register("number_bars")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
              />
              {errors.number_bars && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_bars.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="number_parks"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Parks
              </label>
              <input
                type="number"
                id="number_parks"
                {...register("number_parks")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
              />
              {errors.number_parks && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_parks.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="number_halls"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Halls
              </label>
              <input
                type="number"
                id="number_halls"
                {...register("number_halls")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                min="0"
              />
              {errors.number_halls && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.number_halls.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Entities Multi-Selects */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Related Entities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="regions"
                className="block text-sm font-medium text-gray-700"
              >
                Regions
              </label>
              <select
                multiple
                id="regions"
                {...register("regions")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {regionsData?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.country_name})
                  </option>
                ))}
              </select>
              {errors.regions && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.regions.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="themes"
                className="block text-sm font-medium text-gray-700"
              >
                Themes
              </label>
              <select
                multiple
                id="themes"
                {...register("themes")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {themesData?.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              {errors.themes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.themes.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="meal_types"
                className="block text-sm font-medium text-gray-700"
              >
                Meal Types
              </label>
              <select
                multiple
                id="meal_types"
                {...register("meal_types")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {mealTypesData?.map((mealType) => (
                  <option key={mealType.id} value={mealType.id}>
                    {mealType.name}
                  </option>
                ))}
              </select>
              {errors.meal_types && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.meal_types.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="amenities"
                className="block text-sm font-medium text-gray-700"
              >
                Amenities
              </label>
              <select
                multiple
                id="amenities"
                {...register("amenities")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {amenitiesData?.map((amenity) => (
                  <option key={amenity.id} value={amenity.id}>
                    {amenity.name}
                  </option>
                ))}
              </select>
              {errors.amenities && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.amenities.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="services"
                className="block text-sm font-medium text-gray-700"
              >
                Services
              </label>
              <select
                multiple
                id="services"
                {...register("services")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {servicesData?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.services && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.services.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="facilities"
                className="block text-sm font-medium text-gray-700"
              >
                Facilities
              </label>
              <select
                multiple
                id="facilities"
                {...register("facilities")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {facilitiesData?.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
              {errors.facilities && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.facilities.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="translations"
                className="block text-sm font-medium text-gray-700"
              >
                Translations
              </label>
              <select
                multiple
                id="translations"
                {...register("translations")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              >
                {translationsData?.map((translation) => (
                  <option key={translation.id} value={translation.id}>
                    {translation.language}
                  </option>
                ))}
              </select>
              {errors.translations && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.translations.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Footer (Verification) */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Review Hotel Details:
          </h3>
          <div className="space-y-2 text-gray-600 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <p>
              <strong className="font-semibold">Name:</strong>{" "}
              {watchFields.name || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Code:</strong>{" "}
              {watchFields.code || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Country:</strong>{" "}
              {countriesData?.find((c) => c.id === watchFields.country)?.name ||
                "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Hotel Type:</strong>{" "}
              {hotelTypesData?.find((ht) => ht.id === watchFields.hotel_type)
                ?.name || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Rooms:</strong>{" "}
              {watchFields.number_rooms || 0}
            </p>
            <p>
              <strong className="font-semibold">Floors:</strong>{" "}
              {watchFields.number_floors || 0}
            </p>
            <p>
              <strong className="font-semibold">Restaurants:</strong>{" "}
              {watchFields.number_restaurants || 0}
            </p>
            <p>
              <strong className="font-semibold">Bars:</strong>{" "}
              {watchFields.number_bars || 0}
            </p>
            <p>
              <strong className="font-semibold">Parks:</strong>{" "}
              {watchFields.number_parks || 0}
            </p>
            <p>
              <strong className="font-semibold">Halls:</strong>{" "}
              {watchFields.number_halls || 0}
            </p>
            <p>
              <strong className="font-semibold">Year Built:</strong>{" "}
              {watchFields.year_built || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Address:</strong>{" "}
              {watchFields.address || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Star Rating:</strong>{" "}
              {watchFields.star_rating || 0}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Description:</strong>{" "}
              {watchFields.description || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Zip Code:</strong>{" "}
              {watchFields.zip_code || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Latitude:</strong>{" "}
              {watchFields.latitude || "N/A"}
            </p>
            <p>
              <strong className="font-semibold">Longitude:</strong>{" "}
              {watchFields.longitude || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Regions:</strong>{" "}
              {watchFields.regions
                ?.map((id) => regionsData?.find((r) => r.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Themes:</strong>{" "}
              {watchFields.themes
                ?.map((id) => themesData?.find((t) => t.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Meal Types:</strong>{" "}
              {watchFields.meal_types
                ?.map((id) => mealTypesData?.find((mt) => mt.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Amenities:</strong>{" "}
              {watchFields.amenities
                ?.map((id) => amenitiesData?.find((a) => a.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Services:</strong>{" "}
              {watchFields.services
                ?.map((id) => servicesData?.find((s) => s.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Facilities:</strong>{" "}
              {watchFields.facilities
                ?.map((id) => facilitiesData?.find((f) => f.id === id)?.name)
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
            <p className="md:col-span-2 lg:col-span-3">
              <strong className="font-semibold">Translations:</strong>{" "}
              {watchFields.translations
                ?.map(
                  (id) => translationsData?.find((t) => t.id === id)?.language
                )
                .filter(Boolean)
                .join(", ") || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={createHotelMutation.isPending}
          >
            {createHotelMutation.isPending ? "Creating..." : "Create Hotel"}
          </button>
          {createHotelMutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              Failed to create hotel: {createHotelMutation.error?.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
