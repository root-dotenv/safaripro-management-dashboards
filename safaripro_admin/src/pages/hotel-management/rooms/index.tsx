// safaripro_admin/src/routes/hotel-management/rooms/index.tsx
import { Outlet } from "react-router-dom";

export default function RoomsLayout() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Rooms Management
      </h2>
      <Outlet />
    </div>
  );
}
