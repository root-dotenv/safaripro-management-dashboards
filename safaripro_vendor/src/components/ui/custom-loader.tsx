// src/components/Loader.tsx
import React from "react";

interface LoaderProps {
  message?: string;
}

const CustomLoader: React.FC<LoaderProps> = ({
  message = "Loading data...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E5E7FF] rounded-lg p-6">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#6149E8]"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-4 text-lg font-semibold text-[#6149E8]">{message}</p>
    </div>
  );
};

export default CustomLoader;
