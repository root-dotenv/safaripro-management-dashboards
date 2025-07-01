// types/hotel.ts

/**
 * Interface for Room Counts
 */
export interface IRoomCounts {
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
 * Interface for Availability Status Counts
 */
export interface IAvailabilityStatusCounts {
  Available: number;
  Booked: number;
  Maintenance: number;
}

/**
 * Interface for Room Type Availability
 */
export interface IRoomTypeAvailability {
  status_counts: IAvailabilityStatusCounts;
  total_rooms: number;
  available_rooms: number;
  booked_rooms: number;
  maintenance_rooms: number;
  occupancy_percentage: number;
}

/**
 * Interface for Room Type Pricing
 */
export interface IRoomTypePricing {
  min_price: number;
  max_price: number;
  avg_price: number;
}

/**
 * Interface for Room Type
 */
export interface IRoomType {
  id: string;
  name: string;
  code: string;
  max_occupancy: number;
  bed_type: string;
  room_counts: IRoomCounts;
  availability: IRoomTypeAvailability;
  pricing: IRoomTypePricing;
}

/**
 * Interface for Pricing Data
 */
export interface IPricingData {
  min: number;
  max: number;
  avg: number;
  currency: string;
  has_promotions: boolean;
}

/**
 * Interface for Availability Stats
 */
export interface IAvailabilityStats {
  status_counts: {
    Maintenance: number;
    Available: number;
    Booked: number;
  };
  occupancy_rate: number;
  last_updated: string;
}

/**
 * Interface for Has More
 */
export interface IHasMore {
  images: boolean;
  rooms: boolean;
  staff: boolean;
  promotions: boolean;
  events: boolean;
  activities: boolean;
}

/**
 * Interface for Next Page Tokens
 */
export interface INextPageTokens {
  images: number;
  rooms: number;
  staff: number;
  promotions: number;
  events: number;
  activities: number;
}

/**
 * Interface for Summary Counts
 */
export interface ISummaryCounts {
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
 * Main Hotel Interface
 */
export interface IHotel {
  id: string;
  image_ids: string[];
  room_type: IRoomType[];
  staff_ids: string[];
  promotion_ids: string[];
  event_space_ids: string[];
  department_ids: string[];
  activity_ids: string[];
  maintenance_request_ids: string[];
  pricing_data: IPricingData;
  availability_stats: IAvailabilityStats;
  has_more: IHasMore;
  next_page_tokens: INextPageTokens;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  google_maps_url: string | null;
  summary_counts: ISummaryCounts;
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
  amenities: string[];
  services: string[];
  facilities: string[];
  translations: string[];
}
