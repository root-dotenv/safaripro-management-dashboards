import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./providers/query-provider.tsx";
import HotelProvider from "./providers/hotel-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <HotelProvider>
        <App />
      </HotelProvider>
    </QueryProvider>
  </React.StrictMode>
);
