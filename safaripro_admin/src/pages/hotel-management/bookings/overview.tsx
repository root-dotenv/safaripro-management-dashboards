export default function BookingsOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Bookings Overview
      </h3>
      <p className="text-gray-600">
        View a summary and detailed list of all hotel bookings.
      </p>
      {/* Add your overall bookings summary and listing here */}
      <div className="mt-4 border p-4 rounded-md bg-blue-50">
        <p className="text-gray-500 text-sm">
          Placeholder for general booking statistics and recent bookings.
          <br />
          e.g., Total Bookings, Upcoming Bookings, Completed Bookings
        </p>
      </div>
    </div>
  );
}
