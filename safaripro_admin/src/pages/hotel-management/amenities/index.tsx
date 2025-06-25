// safaripro_admin/src/routes/hotel-management/amenities/index.tsx
import { Outlet } from "react-router-dom";

/**
 * AmenitiesLayout Component
 * Serves as the layout for all sub-routes under /hotel-management/amenities.
 * It renders its child routes via the <Outlet /> component.
 */
export default function AmenitiesLayout() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Amenities Management
      </h2>
      <Outlet /> {/* Renders the matched child route component */}
    </div>
  );
}
