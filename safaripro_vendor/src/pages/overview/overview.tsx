// safaripro_vendor/src/pages/overview/overview.tsx
import React from "react";
// import { useQuery } from "@tanstack/react-query"; // No longer needed for mock data
import { useNavigate } from "react-router-dom";
import {
  FaInfoCircle,
  FaChartBar,
  FaHotel,
  FaBed,
  FaDollarSign,
  FaUsers,
  FaCalendarCheck,
  FaTools,
  FaStar,
  FaConciergeBell,
  FaUtensils,
  FaBuilding,
  FaImages,
  FaClipboardList,
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

// import { useHotel } from "../../providers/hotel-provider"; // No longer needed for mock data directly
// import hotelClient from "../../api/hotel-client"; // No longer needed for mock data
// import bookingClient from "../../api/booking-client"; // No longer needed for mock data
// import CustomLoader from "../../components/ui/custom-loader"; // No longer strictly needed for mock data
import type { Booking } from "../bookings/booking-types"; // Import Booking type
import type { IHotel } from "../../types/hotel-types"; // Import IHotel type

// --- TYPE DEFINITIONS (Re-defined for clarity, though already imported) ---
interface BookingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Booking[];
}

// --- COLORS FOR CHARTS ---
const COLORS = {
  Available: "#10B981", // Green
  Booked: "#F59E0B", // Amber
  Maintenance: "#EF4444", // Red
  Confirmed: "#059669", // Darker Green
  Pending: "#F59E0B", // Amber
  Cancelled: "#DC2626", // Darker Red
  Total: "#3B82F6", // Blue
};

// --- MOCK DATA ---
const mockHotelData: IHotel = {
  id: "b76c84fc-f141-41ef-9a0b-9aaa07449e7b",
  image_ids: ["4ad99f4f-7a51-401d-bb83-6f2db4d28447"],
  room_type: [
    {
      id: "11fa4c10-92e0-41fb-91e7-f2b940a817b6",
      name: "Deluxe Room",
      code: "RT-deluxe-r-001",
      description:
        "A spacious room with additional amenities and better views than standard rooms.",
      max_occupancy: 2,
      bed_type: "Queen Bed",
      size_sqm: null,
      base_price: "61.00",
      images: [],
      amenities: [],
      availability: { Available: 2 },
    },
    {
      id: "142e7fc8-670a-4f2e-8b1f-d96788bd566b",
      name: "Standard Room",
      code: "RT-standard-000",
      description:
        "A basic room with essential amenities, suitable for standard accommodation needs.",
      max_occupancy: 2,
      bed_type: "King Bed",
      size_sqm: null,
      base_price: "119.00",
      images: [],
      amenities: [],
      availability: { Available: 4, Booked: 2, Maintenance: 1 },
    },
    {
      id: "cb261480-7861-4826-801d-c7496dbfa5c2",
      name: "Executive Room",
      code: "RT-executiv-002",
      description:
        "A high-end room with additional amenities for business travelers.",
      max_occupancy: 2,
      bed_type: "Twin Beds",
      size_sqm: null,
      base_price: "138.00",
      images: [],
      amenities: [],
      availability: { Available: 1, Booked: 2 },
    },
  ],
  staff_ids: [],
  promotion_ids: [],
  event_space_ids: [],
  department_ids: [],
  activity_ids: [],
  maintenance_request_ids: [],
  pricing_data: {
    min: 164.32,
    max: 238.38,
    avg: 205.2836,
    currency: "USD",
    has_promotions: false,
  },
  availability_stats: {
    status_counts: {
      Available: 15,
      Booked: 8,
      Maintenance: 2,
    },
    occupancy_rate: 40.0,
    last_updated: "2025-07-03 07:48:18.061253+00:00",
  },
  has_more: {
    images: false,
    rooms: false,
    staff: false,
    promotions: false,
    events: false,
    activities: false,
  },
  next_page_tokens: {
    images: 1,
    rooms: 1,
    staff: 1,
    promotions: 1,
    events: 1,
    activities: 1,
  },
  website_url: "https://www.serenahotels.com/serenahotel/en/dar-es-salaam",
  facebook_url: "https://www.facebook.com/DarEsSalaamSerenaHotel/",
  instagram_url: "https://www.instagram.com/daressalaamserena/",
  twitter_url: null,
  youtube_url: null,
  google_maps_url: "https://maps.app.goo.gl/example",
  summary_counts: {
    rooms: 25,
    images: 2,
    reviews: 120, // Mocked value
    staff: 50, // Mocked value
    event_spaces: 3, // Mocked value
    promotions: 5, // Mocked value
    available_rooms: 15,
    maintenance_requests: 3, // Mocked value
  },
  average_room_price: 205.28,
  occupancy_rate: 60.5, // Adjusted for mock data
  created_by: null,
  updated_by: null,
  deleted_by: null,
  is_active: true,
  is_deleted: false,
  created_at: "2025-07-03T10:48:18.061211+03:00",
  updated_at: "2025-07-03T10:48:18.061253+03:00",
  deleted_at: null,
  name: "Dar es Salaam Serena Hotel",
  code: "TZ001 - 0",
  description:
    "Luxury hotel in the heart of Dar es Salaam offering stunning city views, elegant rooms, and world-class service.",
  star_rating: 5.0,
  zip_code: "14111",
  address: "Ohio Street, Dar es Salaam",
  latitude: -6.8123,
  longitude: 39.2906,
  distance_from_center_km: 1.2,
  destination: "Dar es Salaam",
  score_availability: 8,
  number_rooms: 118,
  number_floors: 6,
  number_restaurants: 3,
  number_bars: 2,
  number_parks: 1,
  number_halls: 5,
  discount: 10,
  timezone: null,
  directions: null,
  is_superhost: true, // Mocked value
  is_eco_certified: true, // Mocked value
  max_discount_percent: 20, // Mocked value
  year_built: 1995,
  number_activities: 6, // Mocked value
  rate_options: "Full Payment",
  check_in_from: "14:00",
  check_out_to: "12:00",
  average_rating: "4.5", // Mocked value
  review_count: 120, // Mocked value
  country: "Tanzania", // Mocked value
  hotel_type: "Luxury", // Mocked value
  regions: ["Coastal", "East Africa"], // Mocked value
  themes: ["Business", "Leisure", "Family"], // Mocked value
  meal_types: ["BB", "HB", "FB", "AI", "RO"], // Mocked value
  amenities: ["WiFi", "Pool", "Gym", "Spa"], // Mocked value
  services: ["Airport Pickup", "Concierge", "Room Service"], // Mocked value
  facilities: ["Conference Hall", "Fitness Center"], // Mocked value
  translations: ["English", "Swahili"], // Mocked value
};

const mockBookingsResponse: BookingsResponse = {
  count: 500, // Total mock bookings
  next: null,
  previous: null,
  results: [
    {
      id: "b1",
      payment_status: "Paid",
      full_name: "John Doe",
      code: "BK-001",
      address: "123 Main St",
      phone_number: 1234567890,
      user_id: "u1",
      device_id: "d1",
      email: "john@example.com",
      start_date: "2025-08-01",
      end_date: "2025-08-05",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p1",
      number_of_booked_property: 1,
      amount_paid: "200.00",
      amount_required: "200.00",
      property_item_type: "Standard Room",
      reference_number: "REF-001",
      booking_status: "Confirmed",
      booking_type: "Online",
      voucher_code: null,
      rating: 5,
      feedback: "Great stay!",
      property_type_details: null,
      service_notes: null,
      special_requests: null,
      booking_source: "Website",
      payment_reference: "PAY-001",
      payment_method: "Credit Card",
      base_price: "200.00",
      price_modifiers: null,
      cancellation_policy: "Strict",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay1",
      original_amount: "200.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn1",
      vendor_payment_amount: "200.00",
      vendor_payment_processed_at: "2025-07-01T10:00:00Z",
      created_at: "2025-07-01T09:00:00Z",
      updated_at: "2025-07-01T09:00:00Z",
      property_item: "prop1",
    },
    {
      id: "b2",
      payment_status: "Pending",
      full_name: "Jane Smith",
      code: "BK-002",
      address: "456 Oak Ave",
      phone_number: 9876543210,
      user_id: "u2",
      device_id: "d2",
      email: "jane@example.com",
      start_date: "2025-09-10",
      end_date: "2025-09-15",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p2",
      number_of_booked_property: 2,
      amount_paid: "0.00",
      amount_required: "300.00",
      property_item_type: "Deluxe Room",
      reference_number: "REF-002",
      booking_status: "Pending",
      booking_type: "Phone",
      voucher_code: null,
      rating: null,
      feedback: null,
      property_type_details: null,
      service_notes: null,
      special_requests: "Early check-in",
      booking_source: "Direct",
      payment_reference: "PAY-002",
      payment_method: "Bank Transfer",
      base_price: "300.00",
      price_modifiers: null,
      cancellation_policy: "Flexible",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay2",
      original_amount: "300.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: false,
      vendor_payment_transaction_id: null,
      vendor_payment_amount: null,
      vendor_payment_processed_at: null,
      created_at: "2025-07-02T11:00:00Z",
      updated_at: "2025-07-02T11:00:00Z",
      property_item: "prop2",
    },
    {
      id: "b3",
      payment_status: "Paid",
      full_name: "Alice Johnson",
      code: "BK-003",
      address: "789 Pine Ln",
      phone_number: 1122334455,
      user_id: "u3",
      device_id: "d3",
      email: "alice@example.com",
      start_date: "2025-07-20",
      end_date: "2025-07-22",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p3",
      number_of_booked_property: 1,
      amount_paid: "150.00",
      amount_required: "150.00",
      property_item_type: "Suite",
      reference_number: "REF-003",
      booking_status: "Cancelled",
      booking_type: "Travel Agent",
      voucher_code: "SAVE10",
      rating: 4,
      feedback: "Good, but noisy.",
      property_type_details: null,
      service_notes: null,
      special_requests: null,
      booking_source: "Agent",
      payment_reference: "PAY-003",
      payment_method: "Credit Card",
      base_price: "150.00",
      price_modifiers: null,
      cancellation_policy: "Moderate",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay3",
      original_amount: "150.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn3",
      vendor_payment_amount: "150.00",
      vendor_payment_processed_at: "2025-07-03T12:00:00Z",
      created_at: "2025-07-03T08:00:00Z",
      updated_at: "2025-07-03T08:00:00Z",
      property_item: "prop3",
    },
    // Add more mock bookings as needed to simulate data
    {
      id: "b4",
      payment_status: "Paid",
      full_name: "Bob Brown",
      code: "BK-004",
      address: "101 Elm St",
      phone_number: 5551234567,
      user_id: "u4",
      device_id: "d4",
      email: "bob@example.com",
      start_date: "2025-08-15",
      end_date: "2025-08-18",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p4",
      number_of_booked_property: 1,
      amount_paid: "400.00",
      amount_required: "400.00",
      property_item_type: "Executive Suite",
      reference_number: "REF-004",
      booking_status: "Confirmed",
      booking_type: "Online",
      voucher_code: null,
      rating: 5,
      feedback: "Excellent service!",
      property_type_details: null,
      service_notes: null,
      special_requests: "Late checkout",
      booking_source: "Website",
      payment_reference: "PAY-004",
      payment_method: "Credit Card",
      base_price: "400.00",
      price_modifiers: null,
      cancellation_policy: "Strict",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay4",
      original_amount: "400.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn4",
      vendor_payment_amount: "400.00",
      vendor_payment_processed_at: "2025-07-04T09:00:00Z",
      created_at: "2025-07-04T08:00:00Z",
      updated_at: "2025-07-04T08:00:00Z",
      property_item: "prop4",
    },
    {
      id: "b5",
      payment_status: "Pending",
      full_name: "Charlie Green",
      code: "BK-005",
      address: "222 River Rd",
      phone_number: 1112223333,
      user_id: "u5",
      device_id: "d5",
      email: "charlie@example.com",
      start_date: "2025-10-01",
      end_date: "2025-10-03",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p5",
      number_of_booked_property: 1,
      amount_paid: "0.00",
      amount_required: "180.00",
      property_item_type: "Standard Room",
      reference_number: "REF-005",
      booking_status: "Pending",
      booking_type: "Online",
      voucher_code: null,
      rating: null,
      feedback: null,
      property_type_details: null,
      service_notes: null,
      special_requests: null,
      booking_source: "Website",
      payment_reference: "PAY-005",
      payment_method: "PayPal",
      base_price: "180.00",
      price_modifiers: null,
      cancellation_policy: "Flexible",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay5",
      original_amount: "180.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: false,
      vendor_payment_transaction_id: null,
      vendor_payment_amount: null,
      vendor_payment_processed_at: null,
      created_at: "2025-07-05T10:00:00Z",
      updated_at: "2025-07-05T10:00:00Z",
      property_item: "prop5",
    },
    {
      id: "b6",
      payment_status: "Paid",
      full_name: "Diana Prince",
      code: "BK-006",
      address: "333 Lake Dr",
      phone_number: 9998887777,
      user_id: "u6",
      device_id: "d6",
      email: "diana@example.com",
      start_date: "2025-09-01",
      end_date: "2025-09-07",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p6",
      number_of_booked_property: 1,
      amount_paid: "700.00",
      amount_required: "700.00",
      property_item_type: "Luxury Suite",
      reference_number: "REF-006",
      booking_status: "Confirmed",
      booking_type: "Direct",
      voucher_code: null,
      rating: 5,
      feedback: "Fantastic experience!",
      property_type_details: null,
      service_notes: null,
      special_requests: "Extra towels",
      booking_source: "Direct",
      payment_reference: "PAY-006",
      payment_method: "Credit Card",
      base_price: "700.00",
      price_modifiers: null,
      cancellation_policy: "Strict",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay6",
      original_amount: "700.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn6",
      vendor_payment_amount: "700.00",
      vendor_payment_processed_at: "2025-07-06T11:00:00Z",
      created_at: "2025-07-06T10:00:00Z",
      updated_at: "2025-07-06T10:00:00Z",
      property_item: "prop6",
    },
    {
      id: "b7",
      payment_status: "Pending",
      full_name: "Eve Adams",
      code: "BK-007",
      address: "444 Hilltop",
      phone_number: 4445556666,
      user_id: "u7",
      device_id: "d7",
      email: "eve@example.com",
      start_date: "2025-11-01",
      end_date: "2025-11-02",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p7",
      number_of_booked_property: 1,
      amount_paid: "0.00",
      amount_required: "120.00",
      property_item_type: "Economy Room",
      reference_number: "REF-007",
      booking_status: "Pending",
      booking_type: "Online",
      voucher_code: null,
      rating: null,
      feedback: null,
      property_type_details: null,
      service_notes: null,
      special_requests: "View of the city",
      booking_source: "Booking.com",
      payment_reference: "PAY-007",
      payment_method: "Credit Card",
      base_price: "120.00",
      price_modifiers: null,
      cancellation_policy: "Flexible",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay7",
      original_amount: "120.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: false,
      vendor_payment_transaction_id: null,
      vendor_payment_amount: null,
      vendor_payment_processed_at: null,
      created_at: "2025-07-07T08:00:00Z",
      updated_at: "2025-07-07T08:00:00Z",
      property_item: "prop7",
    },
    {
      id: "b8",
      payment_status: "Paid",
      full_name: "Frank White",
      code: "BK-008",
      address: "555 Valley Rd",
      phone_number: 7778889999,
      user_id: "u8",
      device_id: "d8",
      email: "frank@example.com",
      start_date: "2025-08-25",
      end_date: "2025-08-28",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p8",
      number_of_booked_property: 1,
      amount_paid: "350.00",
      amount_required: "350.00",
      property_item_type: "Deluxe Room",
      reference_number: "REF-008",
      booking_status: "Confirmed",
      booking_type: "Online",
      voucher_code: null,
      rating: 4,
      feedback: "Good value.",
      property_type_details: null,
      service_notes: null,
      special_requests: null,
      booking_source: "Expedia",
      payment_reference: "PAY-008",
      payment_method: "Credit Card",
      base_price: "350.00",
      price_modifiers: null,
      cancellation_policy: "Moderate",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay8",
      original_amount: "350.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn8",
      vendor_payment_amount: "350.00",
      vendor_payment_processed_at: "2025-07-08T10:00:00Z",
      created_at: "2025-07-08T09:00:00Z",
      updated_at: "2025-07-08T09:00:00Z",
      property_item: "prop8",
    },
    {
      id: "b9",
      payment_status: "Paid",
      full_name: "Grace Black",
      code: "BK-009",
      address: "666 Sunset Blvd",
      phone_number: 2223334444,
      user_id: "u9",
      device_id: "d9",
      email: "grace@example.com",
      start_date: "2025-07-10",
      end_date: "2025-07-12",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p9",
      number_of_booked_property: 1,
      amount_paid: "250.00",
      amount_required: "250.00",
      property_item_type: "Standard Room",
      reference_number: "REF-009",
      booking_status: "Cancelled",
      booking_type: "Online",
      voucher_code: null,
      rating: 3,
      feedback: "Okay.",
      property_type_details: null,
      service_notes: null,
      special_requests: null,
      booking_source: "Website",
      payment_reference: "PAY-009",
      payment_method: "Credit Card",
      base_price: "250.00",
      price_modifiers: null,
      cancellation_policy: "Strict",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay9",
      original_amount: "250.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn9",
      vendor_payment_amount: "250.00",
      vendor_payment_processed_at: "2025-07-09T11:00:00Z",
      created_at: "2025-07-09T10:00:00Z",
      updated_at: "2025-07-09T10:00:00Z",
      property_item: "prop9",
    },
    {
      id: "b10",
      payment_status: "Paid",
      full_name: "Henry Blue",
      code: "BK-010",
      address: "777 Ocean Blvd",
      phone_number: 3334445555,
      user_id: "u10",
      device_id: "d10",
      email: "henry@example.com",
      start_date: "2025-08-01",
      end_date: "2025-08-03",
      checkin: null,
      checkout: null,
      microservice_item_id: "hotel1",
      microservice_item_name: "Mock Hotel",
      property_id: "p10",
      number_of_booked_property: 1,
      amount_paid: "300.00",
      amount_required: "300.00",
      property_item_type: "Deluxe Room",
      reference_number: "REF-010",
      booking_status: "Confirmed",
      booking_type: "Online",
      voucher_code: null,
      rating: 5,
      feedback: "Loved it!",
      property_type_details: null,
      service_notes: null,
      special_requests: "Extra pillows",
      booking_source: "Website",
      payment_reference: "PAY-010",
      payment_method: "Credit Card",
      base_price: "300.00",
      price_modifiers: null,
      cancellation_policy: "Strict",
      cancellation_details: null,
      status_history: [],
      modification_count: 0,
      payment_id: "pay10",
      original_amount: "300.00",
      discount_amount: "0.00",
      discount_percentage: "0.00",
      offer_id: null,
      offer_type: null,
      offer_code: null,
      offer_details: null,
      vendor_payment_processed: true,
      vendor_payment_transaction_id: "txn10",
      vendor_payment_amount: "300.00",
      vendor_payment_processed_at: "2025-07-10T12:00:00Z",
      created_at: "2025-07-10T11:00:00Z",
      updated_at: "2025-07-10T11:00:00Z",
      property_item: "prop10",
    },
  ],
};

export default function MainOverview() {
  const navigate = useNavigate();

  // Replace useHotel and useQuery with mock data
  const hotel = mockHotelData;
  const allBookingsResponse = mockBookingsResponse;

  // Since we're using mock data, loading and error states are simplified
  const hotelLoading = false;
  const hotelError = null;
  const bookingsLoading = false;
  const bookingsError = false;
  const bookingsFetchError = null;

  // --- Process Room Status Data for Pie Chart ---
  const roomStatusData = React.useMemo(() => {
    if (!hotel?.availability_stats?.status_counts) return [];
    const { Available, Booked, Maintenance } =
      hotel.availability_stats.status_counts;
    return [
      { name: "Available", value: Available },
      { name: "Booked", value: Booked },
      { name: "Maintenance", value: Maintenance },
    ];
  }, [hotel]);

  // --- Process Booking Status Data for Bar Chart ---
  const bookingStatusData = React.useMemo(() => {
    if (!allBookingsResponse?.results) return [];

    const bookings = allBookingsResponse.results;
    const confirmedCount = bookings.filter(
      (b) => b.booking_status === "Confirmed"
    ).length;
    const pendingCount = bookings.filter(
      (b) => b.booking_status === "Pending"
    ).length;
    const cancelledCount = bookings.filter(
      (b) => b.booking_status === "Cancelled"
    ).length;

    return [
      { name: "Confirmed", count: confirmedCount },
      { name: "Pending", count: pendingCount },
      { name: "Cancelled", count: cancelledCount },
    ];
  }, [allBookingsResponse]);

  // --- Overall Loading and Error State Handling (simplified for mock data) ---
  if (hotelLoading || bookingsLoading) {
    // In a real app, you'd show a loader. For mock, this won't trigger.
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading dashboard overview...
      </div>
    );
  }

  if (hotelError || bookingsError) {
    // In a real app, you'd show an error message. For mock, this won't trigger.
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading dashboard data.
      </div>
    );
  }

  if (!hotel) {
    // This case should ideally not happen with hardcoded mock data
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-500">
        No hotel data available.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Page Header */}
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
            Dashboard Overview: {hotel.name}
          </h1>
        </div>
        <p className="text-[#202020] text-[0.9375rem] font-medium mt-1 flex items-center">
          <FaInfoCircle className="mr-1.5 opacity-70" size={14} />A quick glance
          at your hotel's key performance indicators and recent activities.
        </p>
      </div>

      {/* --- Key Metrics / KPI Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {/* Total Rooms Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Rooms
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {hotel.number_rooms}
            </p>
          </div>
          <FaHotel className="text-blue-500 dark:text-blue-400 text-4xl opacity-70" />
        </div>

        {/* Available Rooms Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Available Rooms
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {hotel.availability_stats?.status_counts?.Available || 0}
            </p>
          </div>
          <FaBed className="text-green-500 dark:text-green-400 text-4xl opacity-70" />
        </div>

        {/* Occupancy Rate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Occupancy Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {(hotel.occupancy_rate || 0).toFixed(1)}%
            </p>
          </div>
          <FaChartBar className="text-purple-500 dark:text-purple-400 text-4xl opacity-70" />
        </div>

        {/* Average Room Price Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Avg. Room Price
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              ${(hotel.average_room_price || 0).toFixed(2)}
            </p>
          </div>
          <FaDollarSign className="text-orange-500 dark:text-orange-400 text-4xl opacity-70" />
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        {/* Room Status Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FaBed className="mr-2 text-blue-600 dark:text-blue-400" /> Room
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roomStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {roomStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} rooms`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FaClipboardList className="mr-2 text-blue-600 dark:text-blue-400" />{" "}
            Booking Status Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={bookingStatusData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                cursor={{ fill: "transparent" }}
                formatter={(value: number, name: string) => [value, name]}
              />
              <Legend />
              <Bar dataKey="count" name="Bookings">
                {bookingStatusData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Other Summary Counts Section --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 px-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <FaInfoCircle className="mr-2 text-blue-600 dark:text-blue-400" />{" "}
          Additional Summaries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Total Bookings:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {allBookingsResponse?.count || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Total Staff:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.summary_counts?.staff || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Total Reviews:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.summary_counts?.reviews || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Event Spaces:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.summary_counts?.event_spaces || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Promotions:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.summary_counts?.promotions || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Restaurants:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.number_restaurants || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Bars:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.number_bars || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              Floors:
            </span>{" "}
            <p className="mt-1 text-gray-900 dark:text-gray-200">
              {hotel.number_floors || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
