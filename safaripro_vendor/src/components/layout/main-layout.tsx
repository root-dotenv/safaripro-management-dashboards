// - - - safaripro_admin/src/components/layout/main-layout.tsx
import { useState, useEffect } from "react"; // Import useEffect
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

  // Initialize theme from localStorage or default to 'light'
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  // Effect to apply/remove 'dark' class on <html> and update localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (currentTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]); // Re-run effect when currentTheme changes

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavigationBar
        toggleTheme={toggleTheme}
        currentTheme={currentTheme}
        logoText="SafariPro Vendor" // Updated logoText for vendor
      />
      <div className="flex flex-1 overflow-hidden">
        {" "}
        <SideBar collapsed={sidebarCollapsed} toggleCollapse={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-[#F9F9F9] dark:bg-gray-900">
          {" "}
          {/* Apply dark mode background */}
          {children}
        </main>
      </div>
    </div>
  );
}
