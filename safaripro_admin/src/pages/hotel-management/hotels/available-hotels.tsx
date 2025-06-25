export default function AvailableHotels() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Available Hotels
      </h3>
      <p className="text-gray-600">
        This page will display a list of all currently registered hotels.
      </p>
      {/* Add your hotel listing table/components here */}
      <div className="mt-4 border p-4 rounded-md bg-indigo-50">
        <p className="text-gray-500 text-sm">
          Placeholder for hotel data table.
          <br />
          e.g., Grand Safari Lodge, Serengeti Lux Camp, Coastal Breeze Hotel
        </p>
      </div>
    </div>
  );
}
