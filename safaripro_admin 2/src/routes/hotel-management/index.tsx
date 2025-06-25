import { Outlet } from "react-router-dom";

export default function HotelManagementLayout() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Hotel Management</h1>
      <Outlet />
    </div>
  );
}
