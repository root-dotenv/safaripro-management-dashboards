/**
 * @interface RoomCounts
 * @description
 */
export interface RoomCounts {
  Available: number;
  Booked: number;
  Maintenance: number;
  Cancelled: number;
  Pending: number;
  Processing: number;
  Not_Available: number;
  total: number;
}

/**
 * @interface RoomAvailability
 * @description
 */
export interface RoomAvailability {
  status_counts: {
    Available?: number;
    Booked?: number;
    Maintenance?: number;
  };
  total_rooms: number;
  available_rooms: number;
  booked_rooms: number;
  maintenance_rooms: number;
  occupancy_percentage: number;
}

/**
 * @interface RoomPricing
 * @description
 */
export interface RoomPricing {
  min_price: number;
  max_price: number;
  avg_price: number;
}

/**
 * @interface RoomType
 * @description
 */
export interface RoomType {
  id: string;
  name: string;
  code: string;
  max_occupancy: number;
  bed_type: string;
  room_counts: RoomCounts;
  availability: RoomAvailability;
  pricing: RoomPricing;
}

/**
 * @interface PricingData
 * @description
 */
export interface PricingData {
  min: number;
  max: number;
  avg: number;
  currency: string;
  has_promotions: boolean;
}

/**
 * @interface AvailabilityStats
 * @description
 */
export interface AvailabilityStats {
  status_counts: {
    Maintenance?: number;
    Available?: number;
    Booked?: number;
  };
  occupancy_rate: number;
  last_updated: string;
}

/**
 * @interface HasMore
 * @description
 */
export interface HasMore {
  images: boolean;
  rooms: boolean;
  staff: boolean;
  promotions: boolean;
  events: boolean;
  activities: boolean;
}

/**
 * @interface NextPageTokens
 * @description
 */
export interface NextPageTokens {
  images: number;
  rooms: number;
  staff: number;
  promotions: number;
  events: number;
  activities: number;
}

/**
 * @interface SummaryCounts
 * @description
 */
export interface SummaryCounts {
  rooms: number;
  images: number;
  reviews: number;
  staff: number;
  event_spaces: number;
  promotions: number;
  available_rooms: number;
  maintenance_requests: number;
}

/**
 * @interface Hotel
 * @description
 */
export interface Hotel {
  id: string;
  image_ids: string[];
  room_type: RoomType[];
  staff_ids: string[];
  promotion_ids: string[];
  event_space_ids: string[];
  department_ids: string[];
  activity_ids: string[];
  maintenance_request_ids: string[];
  pricing_data: PricingData;
  availability_stats: AvailabilityStats;
  has_more: HasMore;
  next_page_tokens: NextPageTokens;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  google_maps_url: string | null;
  summary_counts: SummaryCounts;
  average_room_price: number;
  occupancy_rate: number;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  code: string;
  description: string;
  star_rating: number;
  zip_code: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_from_center_km: number;
  destination: string;
  score_availability: number;
  number_rooms: number;
  number_floors: number;
  number_restaurants: number;
  number_bars: number;
  number_parks: number;
  number_halls: number;
  discount: number;
  timezone: string | null;
  directions: string | null;
  is_superhost: boolean;
  is_eco_certified: boolean;
  max_discount_percent: number | null;
  year_built: number;
  number_activities: number;
  rate_options: string;
  check_in_from: string;
  check_out_to: string;
  average_rating: string;
  review_count: number;
  country: string;
  hotel_type: string;
  regions: string[];
  themes: string[];
  meal_types: string[];
  facilities: string[];
  translations: string[];
}
