// - - - safaripro_admin/src/components/layout/main-layout.tsx
import { useState } from "react";
import TopNavigationBar from "./top-navigation";
import SideBar from "./side-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavigationBar
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        logoText="SafariPro Admin"
      />
      <div className="flex flex-1 overflow-hidden">
        {" "}
        <SideBar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#F9F9F9] dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
