import React from "react";

const OverviewPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 flex-grow rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Overview Dashboard
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Welcome to your SafariPro Admin Dashboard! Here you can see a summary of
        your system's performance and key metrics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Total Hotels
          </h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            125
          </p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            New Bookings
          </h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            87
          </p>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Active Users
          </h3>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            450
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
