// - - - safaripro_admin/src/pages/bookings/all-bookings.tsx
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"; // Added useMutation, QueryClient
import axios from "axios"; // Using axios directly as requested
import type { Booking } from "./booking-types";
import {
  FaEye, // Removed from rendering, but kept in import for other potential uses
  FaInfoCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaUser,
  FaBed,
  FaSearch,
  FaTimes,
  FaSyncAlt,
  FaFileCsv,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTrash, // Added for delete button
  FaEdit, // Added for edit button
  FaSpinner, // Used for loading state on delete button
} from "react-icons/fa";
import React, { useState, useMemo, useEffect } from "react";
import CustomLoader from "../../components/ui/custom-loader";
import { FiAlertTriangle } from "react-icons/fi";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2"; // For confirmation dialogs
import { toast } from "react-toastify"; // For toast notifications

const queryClient = new QueryClient(); // Initialize QueryClient

// Reusable No Data / Error Message Component (copied from all-rooms.tsx)
const NoDataMessage: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  type?: "info" | "error";
}> = ({ icon: Icon, title, description, type = "info" }) => (
  <div
    className={`p-8 rounded-xl text-center border ${
      type === "error"
        ? "bg-red-50/80 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800"
        : "bg-blue-50/80 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800"
    }`}
  >
    <Icon className="mx-auto h-16 w-16 mb-4 opacity-80" />
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
      {description}
    </p>
  </div>
);

// Custom useDebounce Hook (copied from all-rooms.tsx)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function AllBookings() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search term

  const [sortColumn, setSortColumn] = useState<keyof Booking | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter states
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [bookingSourceFilter, setBookingSourceFilter] = useState("");

  // Fetch all bookings with the hardcoded URL
  const {
    data: bookingsResponse,
    error,
    isLoading,
    isError,
    refetch: refetchBookings, // Add refetch for the "Refetch Bookings" button
  } = useQuery<{
    results: Booking[];
    count: number;
    next: string | null;
    previous: string | null;
  }>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axios.get(
        "https://booking.tradesync.software/api/v1/bookings?microservice_item_id=96e3bfc0-48bd-40f7-a6a8-3c86f11899b6"
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const allBookings = bookingsResponse?.results || [];

  // Filtering logic
  const filteredBookings = useMemo(() => {
    let currentBookings = allBookings;

    // Apply search term
    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
      currentBookings = currentBookings.filter(
        (booking) =>
          booking.code.toLowerCase().includes(lowerCaseSearchTerm) ||
          booking.full_name.toLowerCase().includes(lowerCaseSearchTerm) ||
          booking.microservice_item_name
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          booking.property_item_type
            .toLowerCase()
            .includes(lowerCaseSearchTerm) ||
          booking.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply booking status filter
    if (bookingStatusFilter) {
      currentBookings = currentBookings.filter(
        (booking) => booking.booking_status === bookingStatusFilter
      );
    }

    // Apply payment method filter
    if (paymentMethodFilter) {
      currentBookings = currentBookings.filter(
        (booking) => booking.payment_method === paymentMethodFilter
      );
    }

    // Apply booking source filter
    if (bookingSourceFilter) {
      currentBookings = currentBookings.filter(
        (booking) => booking.booking_source === bookingSourceFilter
      );
    }

    return currentBookings;
  }, [
    allBookings,
    debouncedSearchTerm,
    bookingStatusFilter,
    paymentMethodFilter,
    bookingSourceFilter,
  ]);

  // Sorting logic
  const sortedBookings = useMemo(() => {
    if (!sortColumn) return filteredBookings;

    const sorted = [...filteredBookings].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      // Fallback for other types or nulls
      return 0;
    });
    return sorted;
  }, [filteredBookings, sortColumn, sortDirection]);

  // Unique filter options
  const uniqueBookingStatuses = useMemo(
    () => [...new Set(allBookings.map((b) => b.booking_status))],
    [allBookings]
  );
  const uniquePaymentMethods = useMemo(
    () => [...new Set(allBookings.map((b) => b.payment_method))],
    [allBookings]
  );
  const uniqueBookingSources = useMemo(
    () => [...new Set(allBookings.map((b) => b.booking_source))],
    [allBookings]
  );

  // Mutation for Deleting Booking
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await axios.delete(
        `https://booking.tradesync.software/api/v1/bookings/${bookingId}`
      );
      return response.data;
    },
    onMutate: async (bookingIdToDelete: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["bookings"] });

      // Snapshot the previous value
      const previousBookings = queryClient.getQueryData<{
        results: Booking[];
        count: number;
        next: string | null;
        previous: string | null;
      }>(["bookings"]);

      // Optimistically update to the new value
      queryClient.setQueryData<{
        results: Booking[];
        count: number;
        next: string | null;
        previous: string | null;
      }>(["bookings"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.filter(
            (booking) => booking.id !== bookingIdToDelete
          ),
          count: old.count - 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousBookings };
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully!");
    },
    onError: (err, bookingIdToDelete, context) => {
      toast.error(
        `Error deleting booking: ${err.message || "An unknown error occurred"}`
      );
      // Rollback to the previous data if the mutation fails
      if (context?.previousBookings) {
        queryClient.setQueryData(["bookings"], context.previousBookings);
      }
    },
    onSettled: () => {
      // Invalidate and refetch after error or success to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (isLoading) {
    return <CustomLoader message="Loading bookings..." />;
  }

  if (isError) {
    return (
      <NoDataMessage
        icon={FiAlertTriangle}
        title="Error Loading Bookings!"
        description={
          error?.message || "An unknown error occurred while fetching bookings."
        }
        type="error"
      />
    );
  }

  const showBookingDetailsModal = (bookingId: string) => {
    console.log(`Show details for booking ID: ${bookingId}`);
    // This function can be expanded to navigate to a read-only details page
    // or open a modal displaying more details.
  };

  const handleSort = (column: keyof Booking) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: keyof Booking) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <FaSortUp className="ml-1 text-[#553ED0]" />
      ) : (
        <FaSortDown className="ml-1 text-[#553ED0]" />
      );
    }
    return <FaSort className="ml-1 text-[#838383]" />;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBookingStatusFilter("");
    setPaymentMethodFilter("");
    setBookingSourceFilter("");
    setSortColumn(null);
    setSortDirection("asc");
  };

  const handleEdit = (bookingId: string) => {
    navigate(`/bookings/all-bookings/edit/${bookingId}`); // Navigate to the new edit page
  };

  const handleDelete = (bookingId: string, bookingCode: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete booking "${bookingCode}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBookingMutation.mutate(bookingId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info("Delete action cancelled.");
      }
    });
  };

  const exportBookingsToCsv = (bookingsToExport: Booking[]) => {
    if (!bookingsToExport.length) {
      console.log("No bookings to export to CSV.");
      toast.info("No bookings to export to CSV.");
      return;
    }

    const headers = [
      "Booking ID",
      "Hotel Name",
      "Room Type",
      "Start Date",
      "End Date",
      "Amount Paid",
      "Amount Required",
      "Booking Status",
      "Payment Status",
      "Full Name",
      "Email",
      "Phone Number",
      "Payment Method",
      "Booking Source",
      "Reference Number",
    ];

    const csvContent =
      headers.join(",") +
      "\n" +
      bookingsToExport
        .map((booking) =>
          [
            `"${booking.code}"`,
            `"${booking.microservice_item_name.replace(/"/g, '""')}"`,
            `"${booking.property_item_type.replace(/"/g, '""')}"`,
            `"${booking.start_date}"`,
            `"${booking.end_date}"`,
            `"${parseFloat(booking.amount_paid).toFixed(2)}"`,
            `"${parseFloat(booking.amount_required).toFixed(2)}"`,
            `"${booking.booking_status}"`,
            `"${booking.payment_status}"`,
            `"${booking.full_name.replace(/"/g, '""')}"`,
            `"${booking.email}"`,
            `"${booking.phone_number}"`,
            `"${booking.payment_method}"`,
            `"${booking.booking_source}"`,
            `"${booking.reference_number}"`,
          ].join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `all_bookings_report.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${bookingsToExport.length} bookings to CSV!`);
    } else {
      toast.error("Your browser does not support downloading files directly.");
    }
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    bookingStatusFilter !== "" ||
    paymentMethodFilter !== "" ||
    bookingSourceFilter !== "";

  return (
    <div className="w-full h-full min-h-screen pb-[1rem]">
      {/* Section Header - Consistent with AllRooms and HotelAmenities */}
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
            All Bookings Overview
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
          <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
          View and manage all bookings made for your hotel.
        </p>
      </div>

      {/* Action Buttons: Refetch, Export */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 px-4 mb-6">
        <button
          onClick={() => refetchBookings()}
          className="px-6 py-2 rounded-full flex items-center transition-colors duration-300 flex-shrink-0 mt-4 sm:mt-0 border-[#D1FAE5] border-[1px] bg-[#E5FFE5] text-[#059669] text-[0.875rem] font-medium hover:bg-[#C8F5C8]"
        >
          <FaSyncAlt size={16} className="mr-1.5" />
          Refetch Bookings
        </button>

        <button
          onClick={() => exportBookingsToCsv(sortedBookings)} // Export sorted and filtered data
          className="px-6 py-2 rounded-full flex items-center transition-colors duration-300 flex-shrink-0 mt-4 sm:mt-0 border-[#FFD580] border-[1px] bg-[#FFF8E1] text-[#FFA500] text-[0.875rem] font-medium hover:bg-[#FFE0B2]"
          title="Export current table data to CSV"
        >
          <FaFileCsv size={16} className="mr-1.5" />
          Export CSV
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 px-4">
        <div className="relative w-full py-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-[#E8E8E8]" />
          </div>
          <input
            type="text"
            placeholder="Search bookings by ID, name, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-[7px] pl-10 pr-10 px-[1rem] text-base font-medium border border-[#E8E8E8] rounded-md focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B7280] hover:text-[#334155]"
              title="Clear search"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <h2 className="text-xl font-semibold text-[#334155] mr-2">
            Filter Bookings:
          </h2>

          {/* Booking Status Filter */}
          <select
            value={bookingStatusFilter}
            onChange={(e) => setBookingStatusFilter(e.target.value)}
            className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
          >
            <option value="">All Statuses</option>
            {uniqueBookingStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
          >
            <option value="">All Payment Methods</option>
            {uniquePaymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          {/* Booking Source Filter */}
          <select
            value={bookingSourceFilter}
            onChange={(e) => setBookingSourceFilter(e.target.value)}
            className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium border border-[#E8E8E8] rounded-full focus:outline-none focus:ring-[1.5px] focus:ring-[#553ED0] focus:border-transparent bg-transparent text-[#838383]"
          >
            <option value="">All Booking Sources</option>
            {uniqueBookingSources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-[0.9375rem] py-[0.5rem] border-[1px] rounded-full border-[#E8E8E8] text-[#838383] text-[0.875rem] font-medium flex items-center gap-1.5 transition-all hover:bg-gray-50"
            >
              <FaTimes className="w-3 h-3" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {sortedBookings.length === 0 && hasActiveFilters ? (
        <NoDataMessage
          icon={FaCalendarAlt}
          title="No Matching Bookings Found"
          description="No bookings match your current search or filter criteria."
          type="info"
        />
      ) : sortedBookings.length === 0 && !hasActiveFilters ? (
        <NoDataMessage
          icon={FaCalendarAlt}
          title="No Bookings Found"
          description="There are no bookings to display. Check back later!"
          type="info"
        />
      ) : (
        <div className="overflow-x-auto">
          {" "}
          {/* Removed shadow-md rounded-lg */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                {" "}
                {/* Removed bg-[#E5E6FF] */}
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider"
                >
                  S/N
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("code")}
                >
                  <div className="flex items-center">
                    Booking ID {getSortIcon("code")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("microservice_item_name")}
                >
                  <div className="flex items-center">
                    Hotel Name {getSortIcon("microservice_item_name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("property_item_type")}
                >
                  <div className="flex items-center">
                    Room Type {getSortIcon("property_item_type")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("start_date")}
                >
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" /> CHECKS{" "}
                    {getSortIcon("start_date")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount_required")}
                >
                  <div className="flex items-center">
                    <FaDollarSign className="mr-1" /> AMOUNT{" "}
                    {getSortIcon("amount_required")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("booking_status")}
                >
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-1" /> STATUS{" "}
                    {getSortIcon("booking_status")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("full_name")}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-1" /> GUEST DETAILS{" "}
                    {getSortIcon("full_name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("payment_method")}
                >
                  <div className="flex items-center">
                    PAYMENT METHOD {getSortIcon("payment_method")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("booking_source")}
                >
                  <div className="flex items-center">
                    BOOKING SOURCE {getSortIcon("booking_source")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-[0.875rem] font-medium text-[#838383] uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedBookings.map((booking, index) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    {booking.code}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    <div className="flex items-center">
                      {booking.microservice_item_name}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    <div className="flex items-center">
                      <FaBed className="mr-1 text-[#F59E0B]" />{" "}
                      {/* Orange icon for room type */}
                      {booking.property_item_type}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    Start: {booking.start_date} <br /> End: {booking.end_date}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    Paid:{" "}
                    <span className="font-semibold text-[#059669]">
                      ${parseFloat(booking.amount_paid).toFixed(2)}
                    </span>{" "}
                    <br /> Required:{" "}
                    <span className="font-semibold text-[#EF4444]">
                      ${parseFloat(booking.amount_required).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.booking_status === "Cancelled"
                          ? "bg-[#FEE2E2] text-[#C72A2F]" // Red
                          : booking.booking_status === "Confirmed"
                          ? "bg-[#D1FAE5] text-[#059669]" // Green
                          : "bg-[#FEF9C3] text-[#F59E0B]" // Orange/Yellow for processing/pending
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-[#202020]">
                    <div>{booking.full_name}</div>
                    <div className="text-gray-600">{booking.email}</div>
                    <div className="text-gray-600">{booking.phone_number}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    {booking.payment_method}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-[#202020]">
                    {booking.booking_source}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-[#202020]">
                    <div className="flex space-x-3 justify-center">
                      <button
                        onClick={() => handleEdit(booking.id)}
                        className="hover:text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium text-[0.875rem] transition-colors border-[#D9DAFF] border-[1px] bg-[#E5E6FF] text-[#5A43D6]"
                        title="Edit Booking"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id, booking.code)}
                        disabled={
                          deleteBookingMutation.isLoading &&
                          deleteBookingMutation.variables === booking.id
                        }
                        className="hover:text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium text-[0.875rem] bg-[#ffd6d7] text-[#C72A2F] border-[1px] border-[#fec6c8] transition-colors"
                        title="Delete Booking"
                      >
                        {deleteBookingMutation.isLoading &&
                        deleteBookingMutation.variables === booking.id ? (
                          <FaSpinner className="animate-spin h-4 w-4" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
