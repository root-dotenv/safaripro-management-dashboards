import DashboardLayout from "./components/layout/dashboard-layout";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
