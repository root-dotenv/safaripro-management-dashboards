import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import QueryProvider from "./providers/query-provider";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <App />
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
