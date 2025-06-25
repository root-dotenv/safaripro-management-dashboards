import { createBrowserRouter } from "react-router-dom";
import HotelManagementLayout from "./hotel-management";
import HotelOverview from "./hotel-management/overview";
import HotelsLayout from "./hotel-management/hotels";
import AddHotel from "./hotel-management/hotels/add-hotel";
import HotelTypes from "./hotel-management/hotels/hotel-types";
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
                path: "add-hotel",
                element: <AddHotel />,
              },
              {
                path: "hotel-types",
                element: <HotelTypes />,
              },
            ],
          },
          // Add other hotel management routes here
        ],
      },
      // Add other top-level routes here
    ],
  },
]);
