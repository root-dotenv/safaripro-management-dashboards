export default function SafariProBookings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        SafariPro Bookings
      </h3>
      <p className="text-gray-600">
        This page will list all bookings initiated via the SafariPro platform.
      </p>
      {/* Add your SafariPro bookings table/components here */}
      <div className="mt-4 border p-4 rounded-md bg-green-50">
        <p className="text-gray-500 text-sm">
          Placeholder for SafariPro specific booking data.
          <br />
          e.g., Booking ID: SP-001, Guest: Jane Doe, Hotel: Grand Safari Lodge
        </p>
      </div>
    </div>
  );
}
