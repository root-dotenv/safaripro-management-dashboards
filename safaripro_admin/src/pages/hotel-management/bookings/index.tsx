import { Outlet } from "react-router-dom";

export default function BookingsLayout() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Bookings Management
      </h2>
      <Outlet /> {/* Renders the matched child route component */}
    </div>
  );
}
