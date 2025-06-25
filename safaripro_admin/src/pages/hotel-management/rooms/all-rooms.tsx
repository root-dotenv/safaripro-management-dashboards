export default function AllRooms() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">All Rooms</h3>
      <p className="text-gray-600">
        This page will display a comprehensive list of all rooms.
      </p>
      {/* Add your room listing table/components here */}
      <div className="mt-4 border p-4 rounded-md bg-gray-50">
        <p className="text-gray-500 text-sm">
          Placeholder for room data table.
          <br />
          e.g., Room 101 (Double), Room 205 (Suite)
        </p>
      </div>
    </div>
  );
}
