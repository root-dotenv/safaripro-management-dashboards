// * - - - Main Routing File (3-stages routing i.e Routes > Subroute > Subroute)
import { Routes, Route } from "react-router-dom";
import MainOverview from "../pages/overview/overview";
import Hotel from "../pages/hotel/hotel";
import HotelServices from "../pages/hotel/hotel-services";
import HotelAmenities from "../pages/hotel/hotel-amenities";
import HotelEvents from "../pages/hotel/hotel-events";
import HotelFacilities from "../pages/hotel/hotel-facilities";
import AddRoom from "../pages/rooms/add-room";
import RoomTypes from "../pages/rooms/room-types";
import AllRooms from "../pages/rooms/all-rooms";
import EditRoomPage from "../pages/rooms/edit-room";
import RoomDetailsPage from "../pages/rooms/room-details-page";
import Guest from "../pages/reservations/guests";
import CheckedIn from "../pages/reservations/checked-in";
import CheckedOut from "../pages/reservations/checked-out";
import SpecialRequests from "../pages/reservations/special-requests";
import AvailableRooms from "../pages/bookings/available-rooms";
import SafariproBookings from "../pages/bookings/safaripro-bookings";
import AllBookings from "../pages/bookings/all-bookings";
import HotelMeals from "../pages/hotel/hotel-meals";
import ReportsPage from "../pages/reports/reports";

export default function AppRoutes() {
  return (
    <Routes>
      {/* - - - Main Overview (Default Home Route) */}
      <Route path="/" element={<MainOverview />} />
      {/* - - - Analytics & Financial Routes */}
      {/* <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/financial" element={<FinancialPage />} />
      */}
      <Route path="/reports" element={<ReportsPage />} />
      {/* - - - Hotels Routes */}
      <Route path="/hotel/my-hotel" element={<Hotel />} />
      <Route path="/hotel/hotel-facilities" element={<HotelFacilities />} />
      <Route path="/hotel/hotel-services" element={<HotelServices />} />
      <Route path="/hotel/hotel-amenities" element={<HotelAmenities />} />
      <Route path="/hotel/hotel-meals" element={<HotelMeals />} />
      <Route path="/hotel/hotel-events" element={<HotelEvents />} />
      {/* <Route
        path="/hotels/hotel-types/:hotel_type_id"
        element={<EditHotelType />}
      /> */}
      {/* <Route path="/hotels/edit/:hotelId" element={<NewHotelType />} /> */}
      {/* - - - Rooms Routes */}
      <Route path="/rooms/add-room" element={<AddRoom />} />
      <Route path="/rooms/room-types" element={<RoomTypes />} />
      <Route path="/rooms/all-rooms" element={<AllRooms />} />
      <Route path="/rooms/edit/:roomId" element={<EditRoomPage />} />
      <Route path="/rooms/details/:roomId" element={<RoomDetailsPage />} />
      {/* New route for room details */}
      {/* <Route path="/rooms/edit/:roomId" element={<EditRoomPage />} />   */}

      {/* - - - Reservations Details Routes */}
      <Route path="/reservations/guests" element={<Guest />} />
      <Route path="/reservations/checked-in" element={<CheckedIn />} />
      <Route path="/reservations/checked-out" element={<CheckedOut />} />
      <Route
        path="/reservations/special-requests"
        element={<SpecialRequests />}
      />

      {/* - - - Bookings  Routes */}
      <Route path="/bookings/all-bookings" element={<AllBookings />} />
      <Route
        path="/bookings/safaripro-bookings"
        element={<SafariproBookings />}
      />
      <Route path="/bookings/available-rooms" element={<AvailableRooms />} />
      <Route path="/bookings/special-requests" element={<SpecialRequests />} />

      {/* - - - Amenities Routes */}
      {/* <Route path="/amenities/all-amenities" element={<Amenities />} />
      <Route path="/amenities/new-amenity" element={<NewAmenity />} />
      <Route path="/amenities/edit/:amenity_id" element={<EditAmenity />} /> */}
      {/* - - - Facilities Routes */}
      {/* <Route path="/facilities/all-facilities" element={<Facilities />} />
      <Route path="/facilities/new-facility" element={<NewFacility />} />
      <Route path="/facilities/edit/:facility_id" element={<EditFacility />} /> */}
    </Routes>
  );
}
