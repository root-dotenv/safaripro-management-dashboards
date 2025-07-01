// pages/hotel-facilities.tsx
import { useHotel } from "../../providers/hotel-provider";
import hotelClient from "../../api/hotel-client";
import { useQueries } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaWifi,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaParking,
  FaChild,
  FaBriefcase,
  FaPlaneArrival,
  FaSpa,
  FaCocktail,
} from "react-icons/fa";
import { LuDollarSign } from "react-icons/lu";
import { IoPricetagOutline, IoTicketOutline } from "react-icons/io5";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

// Interface for a single facility
interface IFacility {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null;
  availability: any;
  category_id: string | null;
  category_name: string | null;
  fee_applies: boolean;
  reservation_required: boolean;
  additional_info: string | null;
  additional_info_parsed: Record<string, any>;
  translation_id: string | null;
  translation_language: string | null;
  hotel_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interface for the response when fetching a list of facilities
interface IFacilitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IFacility[];
}

interface FacilityTableProps {
  facilities: IFacility[];
  title: string;
  searchTerm: string;
}

// Helper function to get icon based on facility code
const getFacilityIcon = (code: string, iconUrl: string | null) => {
  if (iconUrl) {
    // If API provides an icon URL, use it
    return (
      <img src={iconUrl} alt={code} className="w-full h-full object-contain" />
    );
  }

  //  - - - Map to react-icons based on code
  switch (code) {
    case "WIFI":
      return <FaWifi className="text-[#3B82F6]" />;
    case "POOL":
      return <FaSwimmingPool className="text-[#3B82F6]" />;
    case "GYM":
      return <FaDumbbell className="text-[#10B981]" />;
    case "REST":
      return <FaUtensils className="text-[#F59E0B]" />;
    case "PARK":
      return <FaParking className="text-[#10B981]" />;
    case "KIDS":
      return <FaChild className="text-[#F59E0B]" />;
    case "BUSI":
      return <FaBriefcase className="text-[#475569]" />;
    case "AIRP":
      return <FaPlaneArrival className="text-[#475569]" />;
    case "SPA":
      return <FaSpa className="text-[#F59E0B]" />;
    case "BAR":
      return <FaCocktail className="text-[#EF4444]" />;
    default:
      return <span className="text-xs text-[#6B7280]">?</span>;
  }
};

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  title,
  searchTerm,
}) => {
  const filteredFacilities = useMemo(() => {
    if (!searchTerm) return facilities;

    const lowercaseSearch = searchTerm.toLowerCase();
    return facilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(lowercaseSearch) ||
        facility.code.toLowerCase().includes(lowercaseSearch) ||
        facility.description.toLowerCase().includes(lowercaseSearch)
    );
  }, [facilities, searchTerm]);

  return (
    <div className="mb-8 pb-10">
      <div className="flex flex-col mb-4 px-4">
        <h2 className="text-xl font-semibold text-[#334155]">{title}</h2>
        <div className="flex items-center gap-x-2.5 mt-2">
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <LuDollarSign size={13} /> fee applies
          </span>
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <IoPricetagOutline />
            name
          </span>
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <IoTicketOutline />
            reservation required
          </span>
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
                FEE APPLIES
              </th>
              <th className="text-left text-[0.875rem] py-3 px-4 font-medium text-[#838383]">
                RESERVATION REQUIRED
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#6B7280]">
                  {searchTerm
                    ? "No facilities found matching your search."
                    : "No facilities available."}
                </td>
              </tr>
            ) : (
              filteredFacilities.map((facility) => (
                <tr
                  key={facility.id}
                  className="border-b border-[#E8E8E8] hover:bg-[#FFF]"
                >
                  {/* - - - facility icon */}
                  <td className="py-4 px-4">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getFacilityIcon(facility.code, facility.icon)}
                    </div>
                  </td>
                  {/* - - - facility code */}
                  <td className="py-4 px-4 font-medium text-[#202020]">
                    {facility.code}
                  </td>
                  {/* - - - facility name */}
                  <td className="py-4 px-4 text-[#202020]">{facility.name}</td>
                  {/* - - - description */}
                  <td className="py-4 px-4 text-[#202020] max-w-xs">
                    <div className="truncate" title={facility.description}>
                      {facility.description}
                    </div>
                  </td>
                  {/* - - - fees applies? */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        facility.fee_applies
                          ? " bg-[#FEE2E2] text-[#DC2626]"
                          : " bg-[#D1FAE5] text-[#059669]"
                      }`}
                    >
                      {facility.fee_applies ? "Yes" : "No"}
                    </span>
                  </td>
                  {/* - - - reservation required? */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        facility.reservation_required
                          ? " bg-[#FEE2E2] text-[#DC2626]"
                          : " bg-[#D1FAE5] text-[#059669]"
                      }`}
                    >
                      {facility.reservation_required ? "Yes" : "No"}
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

export default function HotelFacilities() {
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel();
  const [searchTerm, setSearchTerm] = useState("");

  const hotelFacilityIds = hotel?.facilities || [];

  const queries = [
    {
      queryKey: ["allFacilities"],
      queryFn: async () => {
        const response = await hotelClient.get<IFacilitiesResponse>(
          "https://hotel.tradesync.software/api/v1/facilities/"
        );
        return response.data.results;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !hotelLoading,
    },
    ...hotelFacilityIds.map((facilityId) => ({
      queryKey: ["hotelFacility", facilityId],
      queryFn: async () => {
        const response = await hotelClient.get<IFacility>(
          `v1/facilities/${facilityId}/`
        );
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!hotel?.facilities,
    })),
  ];

  const results = useQueries({ queries });

  const allFacilitiesQueryResult = results[0];
  const hotelSpecificFacilitiesQueryResults = results.slice(1);

  const allFacilitiesLoading = allFacilitiesQueryResult.isLoading;
  const allFacilitiesError = allFacilitiesQueryResult.isError
    ? allFacilitiesQueryResult.error?.message ||
      "Failed to load all facilities."
    : null;
  const allFacilities = allFacilitiesQueryResult.data || [];

  const hotelSpecificFacilitiesLoading =
    hotelSpecificFacilitiesQueryResults.some((query) => query.isLoading);
  const hotelSpecificFacilitiesError = hotelSpecificFacilitiesQueryResults.some(
    (query) => query.isError
  )
    ? "Failed to load some hotel-specific facilities."
    : null;
  const hotelSpecificFacilities = hotelSpecificFacilitiesQueryResults
    .map((query) => query.data)
    .filter((data): data is IFacility => data !== undefined);

  const isLoading =
    hotelLoading || allFacilitiesLoading || hotelSpecificFacilitiesLoading;
  const error =
    hotelError || allFacilitiesError || hotelSpecificFacilitiesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155]">
          Loading facilities...
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
      {/* Section Header */}
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-2.5 ">
            <button>
              <IoChevronBackOutline color="#646464" size={18} />
            </button>
            <button>
              <IoChevronForwardOutline color="#646464" size={18} />
            </button>
          </div>
          <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
            Hotel Facilities Overview
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium">
          Facilities represent amenities or services provided at a hotel
          property level, such as pools, fitness centers, or restaurants.
          Explore what's available at your hotel and across the SafariPro
          Management System.
        </p>
      </div>
      {/* Search Header */}
      <div className="mb-6">
        <div className="relative w-full px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-[7px] pl-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
        </div>
      </div>

      {/* Hotel Facilities Table */}
      <FacilityTable
        facilities={hotelSpecificFacilities}
        title={`${hotel?.name}'s Hotel Facilities`}
        searchTerm={searchTerm}
      />
      {/* All Facilities Table */}
      <FacilityTable
        facilities={allFacilities}
        title="SafariPro Hotel Facilities"
        searchTerm={searchTerm}
      />
    </div>
  );
}
