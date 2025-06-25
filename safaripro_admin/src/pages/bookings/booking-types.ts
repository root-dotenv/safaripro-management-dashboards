/**
 * Interface representing a single booking status history entry.
 */
export interface BookingStatusHistory {
  previous_status?: string;
  new_status?: string;
  status?: string;
  timestamp: string;
  reason: string | null;
  amount_paid?: number;
  payment_reference?: string;
  refund_percentage?: number;
}

/**
 * Interface representing a single booking object.
 */
export interface Booking {
  id: string;
  payment_status: string;
  full_name: string;
  code: string;
  address: string;
  phone_number: number;
  user_id: string | null;
  device_id: string | null;
  email: string;
  start_date: string;
  end_date: string;
  checkin: string | null;
  checkout: string | null;
  microservice_item_id: string;
  microservice_item_name: string;
  property_id: string;
  number_of_booked_property: number;
  amount_paid: string;
  amount_required: string;
  property_item_type: string;
  reference_number: string;
  booking_status: string;
  booking_type: string;
  voucher_code: string | null;
  rating: number | null;
  feedback: string | null;
  property_type_details: string | null;
  service_notes: string | null;
  special_requests: string | null;
  booking_source: string;
  payment_reference: string;
  payment_method: string;
  base_price: string | null;
  price_modifiers: string | null;
  cancellation_policy: string;
  cancellation_details: string | null;
  status_history: BookingStatusHistory[];
  modification_count: number;
  payment_id: string;
  user_profile_id: string | null;
  original_amount: string | null;
  discount_amount: string;
  discount_percentage: string;
  offer_id: string | null;
  offer_type: string | null;
  offer_code: string | null;
  offer_details: string | null;
  created_at: string;
  updated_at: string;
  property_item: string;
}
