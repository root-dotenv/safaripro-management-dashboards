// src/components/RoomDetailModal.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  XMarkIcon,
  UserIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  WifiIcon,
  TvIcon,
  SunIcon,
  LockClosedIcon,
  PhoneIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { CoffeeIcon, SnowflakeIcon } from "lucide-react";

export const RoomDetailModal = ({ roomId, onClose }) => {
  const base_URL = import.meta.env.VITE_BASE_URL;

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["room-details", roomId],
    queryFn: async () => {
      const response = await axios.get(`${base_URL}rooms/${roomId}/`);
      return response.data;
    },
    enabled: !!roomId,
  });

  // Icon mapping for amenities
  const amenityIcons = {
    WiFi: <WifiIcon className="h-5 w-5" />,
    TV: <TvIcon className="h-5 w-5" />,
    "Coffee Maker": <CoffeeIcon className="h-5 w-5" />,
    "Air Conditioning": <SnowflakeIcon className="h-5 w-5" />,
    Heating: <SunIcon className="h-5 w-5" />,
    Safe: <LockClosedIcon className="h-5 w-5" />,
    Phone: <PhoneIcon className="h-5 w-5" />,
    "Mini Bar": <ShoppingBagIcon className="h-5 w-5" />,
    // Add more mappings as needed
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading && (
            <div className="p-8 flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="p-6 text-center">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-800 font-medium">
                  Error loading room details
                </h3>
                <p className="text-red-600 mt-1">{error.message}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {room && (
            <div>
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 p-6 pb-0 flex justify-between items-start border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {room.room_type_name}
                  </h2>
                  <p className="text-gray-500 mt-1">Room {room.code}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {/* Left Column - Image & Description */}
                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                    <img
                      src={room.image}
                      alt={room.room_type_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/800x600?text=Room+Image";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center space-x-2 text-white">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span>
                          {room.average_rating} ({room.review_count} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-sm text-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Description
                    </h3>
                    <p>{room.description}</p>
                  </div>
                </div>

                {/* Right Column - Details & Amenities */}
                <div className="space-y-6">
                  {/* Quick Facts */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Room Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">
                            ${room.price_per_night}/night
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <UserIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Max Occupancy</p>
                          <p className="font-medium">
                            {room.max_occupancy} guests
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckBadgeIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              room.availability_status === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {room.availability_status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <ClockIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in/out</p>
                          <p className="font-medium">3PM / 11AM</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            {amenityIcons[amenity.name] || (
                              <CheckBadgeIcon className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <span className="text-gray-700">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
