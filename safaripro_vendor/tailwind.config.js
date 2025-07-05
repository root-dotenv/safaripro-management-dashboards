/** @type {import('tailwindcss').Config} */
export default {
  // Enable dark mode based on the presence of the 'dark' class in the HTML.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here to be easily referenced
        // These are based on your THEME.md for light mode, and suggested dark mode equivalents
        // Primary Text/Dark Grey
        "custom-dark-grey": "#202020",
        "dark-mode-text-primary": "#F8FAFC", // Suggested light text on dark background

        // Secondary Text/Medium Grey
        "custom-medium-grey": "#334155",
        "dark-mode-text-secondary": "#CBD5E1", // Lighter grey for secondary text

        // Placeholder/Light Grey Text
        "custom-light-grey-text": "#838383",
        "dark-mode-text-placeholder": "#6B7280", // Slightly darker for contrast

        // Border/Divider Grey
        "custom-border-grey": "#E8E8E8",
        "dark-mode-border": "#334155", // Darker border

        // Background Grey (Light)
        "custom-bg-light": "#F8FAFC",
        "dark-mode-bg-primary": "#1A202C", // Very dark background

        // White
        "custom-white": "#FFFFFF",
        "dark-mode-card-bg": "#2D3748", // Darker card background

        // Primary Accent (Purple)
        "custom-purple": "#553ED0",
        "dark-mode-purple": "#7F56D9", // Slightly lighter purple for dark mode visibility
        "custom-darker-purple-hover": "#432DBA", // Existing hover for purple

        // Available/Success (Green)
        "custom-green-light-bg": "#D1FAE5",
        "custom-green-text": "#059669",
        "custom-green-border": "#a8f6cf",
        "dark-mode-green-bg": "#065F46", // Darker green background
        "dark-mode-green-text": "#A7F3D0", // Lighter green text

        // Booked/Warning (Orange/Yellow)
        "custom-orange-light-bg": "#FEF9C3",
        "custom-orange-text": "#F59E0B",
        "custom-orange-border": "#f6d9a6",
        "dark-mode-orange-bg": "#92400E", // Darker orange background
        "dark-mode-orange-text": "#FDBA74", // Lighter orange text

        // Maintenance/Error (Red)
        "custom-red-light-bg": "#FEE2E2",
        "custom-red-text": "#EF4444",
        "custom-darker-red-text": "#C72A2F",
        "custom-red-border": "#febebe",
        "custom-red-even-lighter-bg": "#FEF2F2",
        "dark-mode-red-bg": "#991B1B", // Darker red background
        "dark-mode-red-text": "#FCA5A5", // Lighter red text

        // Info/Blue (for NoDataMessage)
        "custom-info-blue-text": "#2196F3",
        "custom-info-blue-light-bg": "#E0F2FE",
        "custom-info-blue-even-lighter-bg": "#B3E5FC",
        "custom-info-blue-border": "#B3E5FC",
        "dark-mode-info-blue-bg": "#1E3A8A", // Darker blue background
        "dark-mode-info-blue-text": "#93C5FD", // Lighter blue text

        // Edit Button (Light Purple/Blue)
        "custom-edit-bg": "#E5E6FF",
        "custom-edit-text": "#5A43D6",
        "custom-edit-border": "#D9DAFF",
        "dark-mode-edit-bg": "#4338CA", // Darker blue/purple for edit
        "dark-mode-edit-text": "#C4B5FD", // Lighter text

        // Delete Button (Light Red)
        "custom-delete-bg": "#ffd6d7",
        "custom-delete-text": "#C72A2F",
        "custom-delete-border": "#fec6c8",
        "dark-mode-delete-bg": "#991B1B", // Darker red for delete
        "dark-mode-delete-text": "#FECACA", // Lighter text

        // Amber for Ratings
        "custom-amber-text-600": "#D97706", // Approximate text-amber-600
        "custom-amber-400": "#FBBF24", // Approximate text-amber-400
        "dark-mode-amber-text-600": "#FCD34D", // Lighter amber for dark mode
        "dark-mode-amber-400": "#FCD34D", // Lighter amber for dark mode
      },
    },
  },
  plugins: [],
};
