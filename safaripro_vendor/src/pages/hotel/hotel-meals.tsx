// pages/hotel-meals.tsx
import { useHotel } from "../../providers/hotel-provider";
import hotelClient from "../../api/hotel-client";
import { useQueries } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaUtensils, // For general meals
  FaCoffee, // For breakfast
  FaBed, // For room only
  FaGlobe, // For all inclusive
  FaQuestionCircle, // Default icon
} from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import { FiHash } from "react-icons/fi";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

// --- NEW INTERFACE FOR MEAL TYPE ---
interface IMealType {
  id: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  code: string;
  name: string;
  score: number;
  description: string;
  translation: string | null;
}

// --- NEW INTERFACE FOR MEAL TYPES RESPONSE ---
interface IMealTypesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IMealType[];
}

// --- NEW INTERFACE FOR MEAL TYPE TABLE PROPS ---
interface MealTypeTableProps {
  mealTypes: IMealType[];
  title: string;
  searchTerm: string;
  isHotelSpecificTable?: boolean;
}

// Helper function to get icon based on meal type name or code
const getMealTypeIcon = (mealTypeName: string, mealTypeCode: string) => {
  const lowerName = mealTypeName.toLowerCase();
  const upperCode = mealTypeCode.toUpperCase();

  switch (upperCode) {
    case "BB": // Bed & Breakfast
      return <FaCoffee className="text-[#F59E0B]" />;
    case "HB": // Half Board
      return <FaUtensils className="text-[#10B981]" />;
    case "FB": // Full Board
      return <FaUtensils className="text-[#EF4444]" />;
    case "AI": // All Inclusive
      return <FaGlobe className="text-[#3B82F6]" />;
    case "RO": // Room Only
      return <FaBed className="text-[#475569]" />;
    default:
      return <FaQuestionCircle className="text-[#6B7280]" />;
  }
};

const MealTypeTable: React.FC<MealTypeTableProps> = ({
  mealTypes,
  title,
  searchTerm,
  isHotelSpecificTable = false,
}) => {
  const filteredMealTypes = useMemo(() => {
    if (!searchTerm) return mealTypes;

    const lowercaseSearch = searchTerm.toLowerCase();
    return mealTypes.filter(
      (mealType) =>
        mealType.name.toLowerCase().includes(lowercaseSearch) ||
        mealType.code.toLowerCase().includes(lowercaseSearch) ||
        mealType.description.toLowerCase().includes(lowercaseSearch)
    );
  }, [mealTypes, searchTerm]);

  return (
    <div className="mb-8 pb-10">
      <div className="flex flex-col mb-4 px-4">
        <h2 className="text-xl font-semibold text-[#334155]">{title}</h2>
        <div className="flex items-center gap-x-2.5 mt-2">
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <LuClock size={13} /> active
          </span>
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <FiHash /> Meal Type
          </span>
          {/* You can add more specific tags here if needed, similar to amenities/facilities */}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-transparent">
          <thead>
            <tr className="border-b border-[#E8E8E8]">
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                ICON
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                CODE
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                NAME
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                DESCRIPTION
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                SCORE
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                ACTIVE
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMealTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#6B7280]">
                  {isHotelSpecificTable ? (
                    <div className="flex flex-col items-center justify-center">
                      <FaQuestionCircle className="text-4xl text-[#6B7280] mb-2" />
                      <p>No meal types currently available for this hotel.</p>
                      {searchTerm && (
                        <p className="text-sm">
                          No meal types found matching your search.
                        </p>
                      )}
                    </div>
                  ) : searchTerm ? (
                    "No meal types found matching your search."
                  ) : (
                    "No meal types available in the system."
                  )}
                </td>
              </tr>
            ) : (
              filteredMealTypes.map((mealType) => (
                <tr
                  key={mealType.id}
                  className="border-b border-[#E8E8E8] hover:bg-[#FFF]"
                >
                  {/* - - - meal type icon */}
                  <td className="py-4 px-4">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getMealTypeIcon(mealType.name, mealType.code)}
                    </div>
                  </td>
                  {/* - - - meal type code */}
                  <td className="py-4 px-4 font-medium text-[#202020]">
                    {mealType.code}
                  </td>
                  {/* - - - meal type name */}
                  <td className="py-4 px-4 text-[#202020]">{mealType.name}</td>
                  {/* - - - description */}
                  <td className="py-4 px-4 text-[#202020] max-w-xs">
                    <div className="truncate" title={mealType.description}>
                      {mealType.description}
                    </div>
                  </td>
                  {/* - - - score */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#059669]">
                      {mealType.score}
                    </span>
                  </td>
                  {/* - - - is_active */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mealType.is_active
                          ? "bg-[#D1FAE5] text-[#059669]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {mealType.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function HotelMeals() {
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel();
  const [searchTerm, setSearchTerm] = useState("");

  const hotelMealTypeIds = hotel?.meal_types || []; // Use hotel.meal_types for meal type IDs

  const queries = [
    {
      queryKey: ["allMealTypes"], // Changed queryKey
      queryFn: async () => {
        const response = await hotelClient.get<IMealTypesResponse>(
          "https://hotel.tradesync.software/api/v1/meal-types/" // Changed endpoint
        );
        return response.data.results;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !hotelLoading,
    },
    ...hotelMealTypeIds.map((mealTypeId) => ({
      queryKey: ["hotelMealType", mealTypeId], // Changed queryKey
      queryFn: async () => {
        const response = await hotelClient.get<IMealType>(
          `v1/meal-types/${mealTypeId}/` // Changed endpoint
        );
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!hotel?.meal_types,
    })),
  ];

  const results = useQueries({ queries });

  const allMealTypesQueryResult = results[0]; // Changed variable name
  const hotelSpecificMealTypesQueryResults = results.slice(1); // Changed variable name

  const allMealTypesLoading = allMealTypesQueryResult.isLoading; // Changed variable name
  const allMealTypesError = allMealTypesQueryResult.isError
    ? allMealTypesQueryResult.error?.message || "Failed to load all meal types." // Changed message
    : null;
  const allMealTypes = allMealTypesQueryResult.data || []; // Changed variable name

  const hotelSpecificMealTypesLoading = hotelSpecificMealTypesQueryResults.some(
    (query) => query.isLoading
  );
  const hotelSpecificMealTypesError = hotelSpecificMealTypesQueryResults.some(
    (query) => query.isError
  )
    ? "Failed to load some hotel-specific meal types." // Changed message
    : null;
  const hotelSpecificMealTypes = hotelSpecificMealTypesQueryResults
    .map((query) => query.data)
    .filter((data): data is IMealType => data !== undefined); // Changed type cast

  const isLoading =
    hotelLoading || allMealTypesLoading || hotelSpecificMealTypesLoading; // Changed variable names
  const error = hotelError || allMealTypesError || hotelSpecificMealTypesError; // Changed variable names

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155]">
          Loading meal types...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEF2F2] text-[#EF4444]">
        <div className="text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen">
      {/* Section Header (Maintained similar structure) */}
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-2.5">
            <button>
              <IoChevronBackOutline color="#646464" size={18} />
            </button>
            <button>
              <IoChevronForwardOutline color="#646464" size={18} />
            </button>
          </div>
          <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
            Hotel Meal Types Overview
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium">
          Meal types define the dining options available to guests during their
          stay, such as breakfast-only or all-inclusive. Explore what's offered
          at your hotel and across the SafariPro Management System.
        </p>
      </div>
      <div className="mb-6">
        <div className="relative w-full px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search meal types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-[7px] pl-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
        </div>
      </div>

      <MealTypeTable // Changed component name
        mealTypes={hotelSpecificMealTypes} // Changed prop name
        title={`${hotel?.name}'s Hotel Meal Types`} // Changed title
        searchTerm={searchTerm}
        isHotelSpecificTable={true}
      />

      <MealTypeTable // Changed component name
        mealTypes={allMealTypes} // Changed prop name
        title="SafariPro Hotel Meal Types" // Changed title
        searchTerm={searchTerm}
      />
    </div>
  );
}
