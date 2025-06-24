import React, { useState } from "react";
import Sidebar from "./sidebar";
import TopNavigationBar from "./top-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        currentTheme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <TopNavigationBar
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        logoText="SafariPro Admin"
      />
      <div className="flex flex-1">
        {/* <Sidebar /> */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
