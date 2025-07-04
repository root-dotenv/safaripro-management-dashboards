// safaripro_admin/src/pages/bookings/edit-safaripro-booking.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSave,
  FaBan,
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle,
  FaCode,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaTags,
  FaFileAlt,
  FaBuilding,
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import type { Booking } from "./booking-types";

type BookingFormData = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  start_date: string;
  end_date: string;
  checkin: string;
  checkout: string;
  amount_paid: string;
  amount_required: string;
  booking_status: string;
  payment_status: string;
  booking_source: string;
  payment_method: string;
  cancellation_policy: string;
  special_requests: string;
  service_notes: string;
  voucher_code: string;
  rating: string;
  feedback: string;
  // These fields are typically not editable by admin, just for reference
  // code: string;
  // microservice_item_name: string;
  // property_item_type: string;
  // reference_number: string;
  // booking_type: string;
  // id: string;
};

export default function EditSafariproBookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<BookingFormData>({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    start_date: "",
    end_date: "",
    checkin: "",
    checkout: "",
    amount_paid: "",
    amount_required: "",
    booking_status: "",
    payment_status: "",
    booking_source: "",
    payment_method: "",
    cancellation_policy: "",
    special_requests: "",
    service_notes: "",
    voucher_code: "",
    rating: "",
    feedback: "",
  });

  // Fetch specific booking data
  const {
    data: bookingData,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: bookingError,
  } = useQuery<Booking, Error>({
    queryKey: ["booking-detail", bookingId],
    queryFn: async () => {
      const response = await axios.get<Booking>(
        `https://booking.tradesync.software/api/v1/bookings/${bookingId}`
      );
      return response.data;
    },
    enabled: !!bookingId,
    onSuccess: (data) => {
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        phone_number: String(data.phone_number || "") || "",
        address: data.address || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        checkin: data.checkin || "",
        checkout: data.checkout || "",
        amount_paid: String(data.amount_paid) || "",
        amount_required: String(data.amount_required) || "",
        booking_status: data.booking_status || "",
        payment_status: data.payment_status || "",
        booking_source: data.booking_source || "",
        payment_method: data.payment_method || "",
        cancellation_policy: data.cancellation_policy || "",
        special_requests: data.special_requests || "",
        service_notes: data.service_notes || "",
        voucher_code: data.voucher_code || "",
        rating: String(data.rating || "") || "",
        feedback: data.feedback || "",
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for updating the booking
  const updateBookingMutation = useMutation({
    mutationFn: async (updatedData: Partial<BookingFormData>) => {
      const payload = {
        ...updatedData,
        phone_number: updatedData.phone_number
          ? Number(updatedData.phone_number)
          : null,
        amount_paid: updatedData.amount_paid
          ? parseFloat(updatedData.amount_paid)
          : null,
        amount_required: updatedData.amount_required
          ? parseFloat(updatedData.amount_required)
          : null,
        rating: updatedData.rating ? Number(updatedData.rating) : null,
        code: bookingData?.code,
        microservice_item_id: bookingData?.microservice_item_id,
        microservice_item_name: bookingData?.microservice_item_name,
        property_id: bookingData?.property_id,
        number_of_booked_property: bookingData?.number_of_booked_property,
        property_item_type: bookingData?.property_item_type,
        reference_number: bookingData?.reference_number,
        booking_type: bookingData?.booking_type,
      };

      console.log("PATCH Payload being sent (Booking Update):", payload);

      const response = await axios.patch(
        `https://booking.tradesync.software/api/v1/bookings/${bookingId}/`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Booking updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); // Invalidate all bookings list
      queryClient.invalidateQueries({
        queryKey: ["booking-detail", bookingId],
      });
      navigate("/bookings/safaripro-bookings"); // Navigate back to the Safaripro Bookings list
    },
    onError: (error: any) => {
      console.error("Failed to update booking:", error);
      toast.error(
        `Failed to update booking: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updateBookingMutation.isLoading) {
      return;
    }
    updateBookingMutation.mutate(formData);
  };

  if (isBookingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFB]">
        <div className="text-lg text-[#334155] flex items-center">
          <FaSpinner className="animate-spin mr-3 text-2xl text-[#553ED0]" />
          Loading booking details...
        </div>
      </div>
    );
  }

  if (isBookingError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEF2F2]">
        <div className="text-[#EF4444] text-lg flex items-center">
          <FaExclamationCircle className="mr-3 text-2xl" />
          Error: {bookingError?.message || "Failed to load booking details."}
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-lg font-semibold text-[#334155] flex items-center">
          <FaInfoCircle className="mr-3 text-2xl text-[#2196F3]" />
          Booking not found for ID: {bookingId}.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] p-6">
      {/* Header */}
      <div className="w-full px-4 py-4">
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(-1)}>
              <IoChevronBackOutline color="#646464" size={18} />
            </button>
            <button onClick={() => navigate(1)}>
              <IoChevronForwardOutline color="#646464" size={18} />
            </button>
          </div>
          <h1 className="text-[1.375rem] text-[#202020] font-bold text-center">
            Edit Booking: {bookingData.code}
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
          <FaInfoCircle className="mr-1.5 opacity-70" size={14} />
          Update the details for this online booking.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-[#E7EBF5]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Info */}
          <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
            Booking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCode className="inline mr-2 text-[#838383]" />
                Booking Code (Read-Only)
              </label>
              <input
                type="text"
                id="code"
                value={bookingData.code}
                className="w-full p-2 border border-[#E8E8E8] rounded-md bg-[#F0F0F0] text-[#202020] cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="hotelName"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaBuilding className="inline mr-2 text-[#838383]" />
                Hotel Name (Read-Only)
              </label>
              <input
                type="text"
                id="hotelName"
                value={bookingData.microservice_item_name}
                className="w-full p-2 border border-[#E8E8E8] rounded-md bg-[#F0F0F0] text-[#202020] cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="roomType"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaTags className="inline mr-2 text-[#838383]" />
                Room Type (Read-Only)
              </label>
              <input
                type="text"
                id="roomType"
                value={bookingData.property_item_type}
                className="w-full p-2 border border-[#E8E8E8] rounded-md bg-[#F0F0F0] text-[#202020] cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          {/* Guest Details */}
          <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4 pt-6">
            Guest Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaUser className="inline mr-2 text-[#838383]" />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaEnvelope className="inline mr-2 text-[#838383]" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaPhone className="inline mr-2 text-[#838383]" />
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaMapMarkerAlt className="inline mr-2 text-[#838383]" />
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
          </div>

          {/* Dates & Times */}
          <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4 pt-6">
            Dates & Times
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCalendarAlt className="inline mr-2 text-[#838383]" />
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCalendarAlt className="inline mr-2 text-[#838383]" />
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="checkin"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCalendarAlt className="inline mr-2 text-[#838383]" />
                Check-in (e.g., YYYY-MM-DDTHH:MM:SS)
              </label>
              <input
                type="datetime-local"
                id="checkin"
                name="checkin"
                value={formData.checkin ? formData.checkin.slice(0, 16) : ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="checkout"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCalendarAlt className="inline mr-2 text-[#838383]" />
                Check-out (e.g., YYYY-MM-DDTHH:MM:SS)
              </label>
              <input
                type="datetime-local"
                id="checkout"
                name="checkout"
                value={formData.checkout ? formData.checkout.slice(0, 16) : ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
          </div>

          {/* Financials & Status */}
          <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4 pt-6">
            Financials & Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="amount_paid"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaDollarSign className="inline mr-2 text-[#838383]" />
                Amount Paid ($)
              </label>
              <input
                type="number"
                id="amount_paid"
                name="amount_paid"
                value={formData.amount_paid}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="amount_required"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaDollarSign className="inline mr-2 text-[#838383]" />
                Amount Required ($)
              </label>
              <input
                type="number"
                id="amount_required"
                name="amount_required"
                value={formData.amount_required}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="booking_status"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaInfoCircle className="inline mr-2 text-[#838383]" />
                Booking Status
              </label>
              <select
                id="booking_status"
                name="booking_status"
                value={formData.booking_status}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Paid">Paid</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
                <option value="Refunded">Refunded</option>
                <option value="In Progress">In Progress</option>
                <option value="Reserved">Reserved</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="payment_status"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaInfoCircle className="inline mr-2 text-[#838383]" />
                Payment Status
              </label>
              <select
                id="payment_status"
                name="payment_status"
                value={formData.payment_status}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              >
                <option value="">Select Payment Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="payment_method"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaDollarSign className="inline mr-2 text-[#838383]" />
                Payment Method
              </label>
              <input
                type="text"
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="booking_source"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaTags className="inline mr-2 text-[#838383]" />
                Booking Source
              </label>
              <input
                type="text"
                id="booking_source"
                name="booking_source"
                value={formData.booking_source}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="cancellation_policy"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaFileAlt className="inline mr-2 text-[#838383]" />
                Cancellation Policy
              </label>
              <input
                type="text"
                id="cancellation_policy"
                name="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="voucher_code"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaCode className="inline mr-2 text-[#838383]" />
                Voucher Code
              </label>
              <input
                type="text"
                id="voucher_code"
                name="voucher_code"
                value={formData.voucher_code}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
          </div>

          {/* Requests & Feedback */}
          <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4 pt-6">
            Requests & Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="special_requests"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaFileAlt className="inline mr-2 text-[#838383]" />
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] resize-none bg-[#F8FAFC] text-[#202020]"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="service_notes"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaFileAlt className="inline mr-2 text-[#838383]" />
                Service Notes
              </label>
              <textarea
                id="service_notes"
                name="service_notes"
                value={formData.service_notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] resize-none bg-[#F8FAFC] text-[#202020]"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaInfoCircle className="inline mr-2 text-[#838383]" />
                Rating (1-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] bg-[#F8FAFC] text-[#202020]"
              />
            </div>
            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-[#6B7280] mb-1"
              >
                <FaFileAlt className="inline mr-2 text-[#838383]" />
                Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-[#E8E8E8] rounded-md focus:ring-[#553ED0] focus:border-[#553ED0] resize-none bg-[#F8FAFC] text-[#202020]"
              ></textarea>
            </div>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => navigate("/bookings/safaripro-bookings")}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-[#F2F7FA] hover:bg-gray-200 text-[#6B7280] shadow"
            >
              <FaBan className="inline mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={updateBookingMutation.isLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${
                !updateBookingMutation.isLoading
                  ? "bg-[#553ED0] hover:bg-[#432DBA] text-white shadow"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {updateBookingMutation.isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <FaSave className="inline mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
