// * - - - Main Routing File (3-stages routing i.e Routes > Subroute > Subroute)
import { Routes, Route } from "react-router-dom";
import MainOverview from "../pages/overview/overview";
import GuestsPage from "../pages/guests/guests";
import GuestDetailsPage from "../pages/guests/guest-details";
import AddRoom from "../pages/rooms/add-room";
import RoomCategories from "../pages/rooms/room-categories";
import AllRooms from "../pages/rooms/all-rooms";
import EditRoomPage from "../pages/rooms/edit-room";
import AvailableRooms from "../pages/bookings/available-rooms";
import CreateBookingForm from "../pages/bookings/create-booking-form";
import SafariproBookings from "../pages/bookings/safaripro-bookings";
import AllBookings from "../pages/bookings/all-bookings";
import EditBooking from "../pages/bookings/edit-booking";
import AddRoomCategory from "../pages/rooms/add-room-category";

export default function AppRoutes() {
  return (
    <Routes>
      {/* - - - Main Overview (Default Home Route) */}
      <Route path="/" element={<MainOverview />} />
      {/* - - - Guests Routes */}
      <Route path="/guests" element={<GuestsPage />} />
      <Route path="/guests/:guestId" element={<GuestDetailsPage />} />
      {/* - - - Rooms Routes */}
      <Route path="/rooms/add-room" element={<AddRoom />} />
      <Route path="/rooms/room-categories" element={<RoomCategories />} />
      <Route path="/rooms/add-categories" element={<AddRoomCategory />} />
      <Route path="/rooms/all-rooms" element={<AllRooms />} />
      <Route path="/rooms/edit/:roomId" element={<EditRoomPage />} />
      {/* - - - Bookings Routes */}
      <Route path="/bookings/new-booking" element={<AvailableRooms />} />{" "}
      {/* Changed component */}
      <Route
        path="/bookings/new-booking/:roomId"
        element={<CreateBookingForm />}
      />{" "}
      {/* NEW ROUTE */}
      <Route
        path="/bookings/safaripro-bookings"
        element={<SafariproBookings />}
      />
      <Route path="/bookings/all-bookings" element={<AllBookings />} />
      <Route
        path="/bookings/all-bookings/:bookingId"
        element={<EditBooking />}
      />
    </Routes>
  );
}
