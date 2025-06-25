// safaripro_admin/src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <div>Dashboard Home</div>,
      },
      {
        path: "hotel-management",
        element: <HotelManagementLayout />,
        children: [
          {
            index: true,
            element: <HotelOverview />,
          },
          {
            path: "hotels",
            element: <HotelsLayout />,
            children: [
              {
                index: true,
                element: <AvailableHotels />,
              },
              {
                path: "add-hotel",
                element: <AddHotel />,
              },
              {
                path: "hotel-types",
                element: <HotelTypes />,
              },
            ],
          },
          {
            path: "rooms",
            element: <RoomsLayout />,
            children: [
              {
                index: true,
                element: <AllRooms />,
              },
              {
                path: "add-room-type",
                element: <AddRoomType />,
              },
              {
                path: "room-types",
                element: <RoomTypes />,
              },
            ],
          },
          {
            path: "bookings",
            element: <BookingsLayout />,
            children: [
              {
                path: "safaripro",
                element: <SafariProBookings />,
              },
              {
                path: "overview",
                index: true,
                element: <BookingsOverview />,
              },
            ],
          },
          {
            path: "facilities",
            element: <FacilitiesLayout />,
            children: [
              {
                index: true,
                element: <AllFacilities />,
              },
              {
                path: "add-facility",
                element: <AddFacility />,
              },
              {
                path: "facility-types",
                element: <FacilityTypes />,
              },
            ],
          },
          {
            path: "amenities",
            element: <AmenitiesLayout />,
            children: [
              {
                path: "add-amenity",
                element: <AddAmenity />,
              },
              {
                index: true,
                element: <AllAmenities />,
              },
            ],
          },
        ],
      },

      // - - - Car Rental Management : Upcoming
      {
        path: "car-rental",
        element: <div>Car Rental Dashboard (To be implemented)</div>,
      },
      // - - - Tour Guide Management : Upcoming
      {
        path: "tour-guide",
        element: <div>Tour Guide Dashboard (To be implemented)</div>,
      },
      // - - - Cab Management : Upcoming
      {
        path: "cab-management",
        element: <div>Cab Management Dashboard (To be implemented)</div>,
      },
    ],
  },
]);
