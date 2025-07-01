import { BrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/main-layout";
import AppRoutes from "./routes";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}
