// pages/hotel-amenities.tsx
import { useHotel } from "../../providers/hotel-provider";
import hotelClient from "../../api/hotel-client";
import { useQueries } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { MdOutlineIron } from "react-icons/md";
import { FiHash } from "react-icons/fi";

import {
  FaSearch,
  FaWifi,
  FaShower,
  FaSnowflake,
  FaDoorOpen,
  FaBath,
  FaDesktop,
  FaGlassMartiniAlt,
  FaLock,
  FaTv,
  FaCoffee,
  FaWind,
  FaWater,
  FaQuestionCircle,
} from "react-icons/fa";
import { LuClock } from "react-icons/lu";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

interface IAmenity {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IAmenitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IAmenity[];
}

interface AmenityTableProps {
  amenities: IAmenity[];
  title: string;
  searchTerm: string;
  isHotelSpecificTable?: boolean;
}

const getAmenityIcon = (iconString: string | null) => {
  if (!iconString) {
    return <FaQuestionCircle className="text-[#6B7280]" />;
  }

  switch (iconString) {
    case "wind":
      return <FaWind className="text-[#3B82F6]" />;
    case "shower":
      return <FaShower className="text-[#3B82F6]" />;
    case "snowflake":
      return <FaSnowflake className="text-[#3B82F6]" />;
    case "door-open":
      return <FaDoorOpen className="text-[#F59E0B]" />;
    case "wifi":
      return <FaWifi className="text-[#10B981]" />;
    case "bath":
      return <FaBath className="text-[#475569]" />;
    case "iron":
      return <MdOutlineIron size={17} className="text-[#F59E0B]" />;
    case "desktop":
      return <FaDesktop className="text-[#475569]" />;
    case "glass-martini":
      return <FaGlassMartiniAlt className="text-[#EF4444]" />;
    case "lock":
      return <FaLock className="text-[#F59E0B]" />;
    case "tv":
      return <FaTv className="text-[#10B981]" />;
    case "coffee":
      return <FaCoffee className="text-[#F59E0B]" />;
    case "water":
      return <FaWater className="text-[#3B82F6]" />;
    default:
      return <FaQuestionCircle className="text-[#6B7280]" />;
  }
};

const AmenityTable: React.FC<AmenityTableProps> = ({
  amenities,
  title,
  searchTerm,
  isHotelSpecificTable = false,
}) => {
  const filteredAmenities = useMemo(() => {
    if (!searchTerm) return amenities;

    const lowercaseSearch = searchTerm.toLowerCase();
    return amenities.filter(
      (amenity) =>
        amenity.name.toLowerCase().includes(lowercaseSearch) ||
        amenity.code.toLowerCase().includes(lowercaseSearch) ||
        amenity.description.toLowerCase().includes(lowercaseSearch)
    );
  }, [amenities, searchTerm]);

  return (
    <div className="mb-8 pb-10">
      <div className="flex flex-col mb-4 px-4">
        <h2 className="text-xl font-semibold text-[#334155]">{title}</h2>
        <div className="flex items-center gap-x-2.5 mt-2">
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <LuClock size={13} /> active
          </span>
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <FiHash /> Amenity
          </span>
          <span className="flex items-center gap-1.5 border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium px-[0.9375rem] py-1 transition-all">
            <IoAdd />
            extra
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
                AVAILABLE
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAmenities.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#6B7280]">
                  {isHotelSpecificTable ? (
                    <div className="flex flex-col items-center justify-center">
                      <FaQuestionCircle className="text-4xl text-[#6B7280] mb-2" />
                      <p>No amenities currently available for this hotel.</p>
                      {searchTerm && (
                        <p className="text-sm">
                          No amenities found matching your search.
                        </p>
                      )}
                    </div>
                  ) : searchTerm ? (
                    "No amenities found matching your search."
                  ) : (
                    "No amenities available in the system."
                  )}
                </td>
              </tr>
            ) : (
              filteredAmenities.map((amenity) => (
                <tr
                  key={amenity.id}
                  className="border-b border-[#E8E8E8] hover:bg-[#FFF]"
                >
                  <td className="py-4 px-4">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getAmenityIcon(amenity.icon)}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-[#202020]">
                    {amenity.code}
                  </td>
                  <td className="py-4 px-4 text-[#202020]">{amenity.name}</td>
                  <td className="py-4 px-4 text-[#202020] max-w-xs">
                    <div className="truncate" title={amenity.description}>
                      {amenity.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        amenity.is_active
                          ? "bg-[#D1FAE5] text-[#059669]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {amenity.is_active ? "Yes" : "No"}
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

export default function HotelAmenities() {
  const { hotel, loading: hotelLoading, error: hotelError } = useHotel();
  const [searchTerm, setSearchTerm] = useState("");

  const hotelAmenityIds = hotel?.amenities || [];

  const queries = [
    {
      queryKey: ["allAmenities"],
      queryFn: async () => {
        const response = await hotelClient.get<IAmenitiesResponse>(
          "https://hotel.tradesync.software/api/v1/amenities/"
        );
        return response.data.results;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !hotelLoading,
    },
    ...hotelAmenityIds.map((amenityId) => ({
      queryKey: ["hotelAmenity", amenityId],
      queryFn: async () => {
        const response = await hotelClient.get<IAmenity>(
          `v1/amenities/${amenityId}/`
        );
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!hotel?.amenities,
    })),
  ];

  const results = useQueries({ queries });

  const allAmenitiesQueryResult = results[0];
  const hotelSpecificAmenitiesQueryResults = results.slice(1);

  const allAmenitiesLoading = allAmenitiesQueryResult.isLoading;
  const allAmenitiesError = allAmenitiesQueryResult.isError
    ? allAmenitiesQueryResult.error?.message || "Failed to load all amenities."
    : null;
  const allAmenities = allAmenitiesQueryResult.data || [];

  const hotelSpecificAmenitiesLoading = hotelSpecificAmenitiesQueryResults.some(
    (query) => query.isLoading
  );
  const hotelSpecificAmenitiesError = hotelSpecificAmenitiesQueryResults.some(
    (query) => query.isError
  )
    ? "Failed to load some hotel-specific amenities."
    : null;
  const hotelSpecificAmenities = hotelSpecificAmenitiesQueryResults
    .map((query) => query.data)
    .filter((data): data is IAmenity => data !== undefined);

  const isLoading =
    hotelLoading || allAmenitiesLoading || hotelSpecificAmenitiesLoading;
  const error = hotelError || allAmenitiesError || hotelSpecificAmenitiesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155]">
          Loading amenities...
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
            Hotel Amenities Overview
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium">
          Amenities are features or services provided within a hotel room, such
          as Wi-Fi, air conditioning, or a minibar. Explore what's available in
          your hotel rooms and across the SafariPro Management System.
        </p>
      </div>
      <div className="mb-6">
        <div className="relative w-full px-4 py-3">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-[7px] pl-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
        </div>
      </div>

      <AmenityTable
        amenities={hotelSpecificAmenities}
        title={`${hotel?.name}'s Hotel Amenities`}
        searchTerm={searchTerm}
        isHotelSpecificTable={true}
      />

      <AmenityTable
        amenities={allAmenities}
        title="SafariPro Hotel Amenities"
        searchTerm={searchTerm}
      />
    </div>
  );
}
