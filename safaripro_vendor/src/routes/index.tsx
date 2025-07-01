// * - - - Main Routing File (3-stages routing i.e Routes > Subroute > Subroute)
import { Routes, Route } from "react-router-dom";
import MainOverview from "../pages/overview/overview";
// import AvailableRooms from "../pages/bookings/available-rooms";
// import SafariproBookings from "../pages/bookings/safaripro-bookings";
// import AllBookings from "../pages/bookings/all-bookings";
// import FinancialPage from "../pages/financial/financial";
// import ReportsPage from "../pages/reports/reports";
// import AnalyticsPage from "../pages/analytics/analytics";
// import RoomTypes from "../pages/rooms/room-types";
// import NewRoomTypes from "../pages/rooms/new-room-types";
// import EditRoomType from "../pages/rooms/edit-room-type";
// import Amenities from "../pages/amenities/amenities";
// import NewAmenity from "../pages/amenities/new-amenity";
// import EditAmenity from "../pages/amenities/edit-amenity";
// import Facilities from "../pages/facilities/facilities";
// import NewFacility from "../pages/facilities/new-facilities";
// import EditFacility from "../pages/facilities/edit-facility";
import Hotel from "../pages/hotel/hotel";
import HotelServices from "../pages/hotel/hotel-services";
import HotelAmenities from "../pages/hotel/hotel-amenities";
import HotelEvents from "../pages/hotel/hotel-events";

export default function AppRoutes() {
  return (
    <Routes>
      {/* - - - Main Overview (Default Home Route) */}
      <Route path="/" element={<MainOverview />} />
      {/* - - - Analytics & Financial Routes */}
      {/* <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/financial" element={<FinancialPage />} />
      <Route path="/reports" element={<ReportsPage />} /> */}

      {/* - - - Hotels Routes */}
      <Route path="/hotel/my-hotel" element={<Hotel />} />
      <Route path="/hotel/hotel-facilities" element={<Hotel />} />
      <Route path="/hotel/hotel-services" element={<HotelServices />} />
      <Route path="/hotel/hotel-amenities" element={<HotelAmenities />} />
      <Route path="/hotel/hotel-events" element={<HotelEvents />} />
      {/* <Route
        path="/hotels/hotel-types/:hotel_type_id"
        element={<EditHotelType />}
      /> */}
      {/* <Route path="/hotels/edit/:hotelId" element={<NewHotelType />} /> */}

      {/* - - - Rooms Routes */}
      {/* <Route path="/rooms/room-types" element={<RoomTypes />} />
      <Route path="/rooms/new-room-types" element={<NewRoomTypes />} />
      <Route path="/rooms/edit/:room_type_id" element={<EditRoomType />} /> */}
      {/* <Route path="/rooms/edit/:roomId" element={<EditRoomPage />} /> */}
      {/* - - - Bookings Routes */}
      {/* <Route path="/bookings/all-bookings" element={<AllBookings />} />
      <Route
        path="/bookings/safaripro-bookings"
        element={<SafariproBookings />}
      />
      <Route path="/bookings/available-rooms" element={<AvailableRooms />} /> */}
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
