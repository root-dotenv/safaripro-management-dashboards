// * - - - Main Routing File (3-stages routing i.e Routes > Subroute > Subroute)
import { Routes, Route } from "react-router-dom";
import MainOverview from "../pages/overview/overview";
import AvailableRooms from "../pages/bookings/available-rooms";
import SafariproBookings from "../pages/bookings/safaripro-bookings";
import AllBookings from "../pages/bookings/all-bookings";
import FinancialPage from "../pages/financial/financial";
import ReportsPage from "../pages/reports/reports";
import AnalyticsPage from "../pages/analytics/analytics";
import NewHotel from "../pages/hotel/new-hotel";
import Hotels from "../pages/hotel/hotels";
import HotelTypes from "../pages/hotel/hotel-types";
import NewHotelType from "../pages/hotel/new-hotel-type";
import RoomTypes from "../pages/rooms/room-types";
import NewRoomTypes from "../pages/rooms/new-room-types";
import EditRoomType from "../pages/rooms/edit-room-type";
import HotelDetails from "../pages/hotel/hotel-details";
import EditHotelType from "../pages/hotel/edit-hotel-type";
import Amenities from "../pages/amenities/amenities";
import NewAmenity from "../pages/amenities/new-amenity";
import EditAmenity from "../pages/amenities/edit-amenity";

export default function AppRoutes() {
  return (
    <Routes>
      {/* - - - Main Overview (Default Home Route) */}
      <Route path="/" element={<MainOverview />} />
      {/* - - - Analytics & Financial Routes */}
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/financial" element={<FinancialPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      {/* - - - Hotels Routes */}
      <Route path="/hotels/new-hotel" element={<NewHotel />} />
      <Route path="/hotels/all-hotels" element={<Hotels />} />
      <Route path="/hotels/hotel-types" element={<HotelTypes />} />
      <Route path="/hotels/new-hotel-types" element={<NewHotelType />} />
      <Route path="/hotels/:hotel_id" element={<HotelDetails />} />
      <Route
        path="/hotels/hotel-types/:hotel_type_id"
        element={<EditHotelType />}
      />
      {/* <Route path="/hotels/edit/:hotelId" element={<NewHotelType />} /> */}
      {/* - - - Rooms Routes */}
      <Route path="/rooms/room-types" element={<RoomTypes />} />
      <Route path="/rooms/new-room-types" element={<NewRoomTypes />} />
      <Route path="/rooms/edit/:room_type_id" element={<EditRoomType />} />
      {/* <Route path="/rooms/edit/:roomId" element={<EditRoomPage />} /> */}
      {/* - - - Bookings Routes */}
      <Route path="/bookings/all-bookings" element={<AllBookings />} />
      <Route
        path="/bookings/safaripro-bookings"
        element={<SafariproBookings />}
      />
      <Route path="/bookings/available-rooms" element={<AvailableRooms />} />
      {/* - - - Amenities Routes */}
      <Route path="/amenities" element={<Amenities />} />
      <Route path="/amenities/new-amenity" element={<NewAmenity />} />
      <Route path="/amenities/edit/:amenity_id" element={<EditAmenity />} />
    </Routes>
  );
}
