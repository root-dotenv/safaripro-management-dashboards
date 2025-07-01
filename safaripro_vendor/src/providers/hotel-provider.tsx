import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import hotelClient from "../api/hotel-client";
import type { IHotel } from "../types/hotel-types";

// Define the shape of our context data
interface HotelContextType {
  hotel: IHotel | null;
  loading: boolean;
  error: string | null;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

/**
 * @param {Object} props
 * @param {ReactNode} props.children
 */
export default function HotelProvider({ children }: { children: ReactNode }) {
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hotel_id = import.meta.env.VITE_HOTEL_ID;

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hotelClient.get<IHotel>(
          `v1/hotels/${hotel_id}/`
        );
        setHotel(response.data);
      } catch (err) {
        console.error("Failed to fetch hotel data:", err);
        setError("Failed to load hotel data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  // - - - Provide the hotel data, loading state, and error state to children
  return (
    <HotelContext.Provider value={{ hotel, loading, error }}>
      {children}
    </HotelContext.Provider>
  );
}

/**
 * @returns {HotelContextType}
 */
export const useHotel = (): HotelContextType => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotel must be used within a HotelProvider");
  }
  return context;
};
