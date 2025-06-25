import { Outlet } from "react-router-dom";

export default function HotelsLayout() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Hotels</h2>
      <Outlet />
    </div>
  );
}
