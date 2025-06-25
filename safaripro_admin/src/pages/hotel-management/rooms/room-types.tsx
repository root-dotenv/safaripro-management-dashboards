export default function RoomTypes() {
  const dummyRoomTypes = [
    {
      id: 1,
      name: "Standard Single",
      description: "Basic room with one single bed.",
    },
    {
      id: 2,
      name: "Standard Double",
      description: "Basic room with one double bed or two single beds.",
    },
    {
      id: 3,
      name: "Deluxe King",
      description: "Larger room with a king-size bed and upgraded amenities.",
    },
    {
      id: 4,
      name: "Executive Suite",
      description:
        "Spacious suite with separate living area and premium features.",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Manage Room Types
      </h3>
      <p className="text-gray-600 mb-4">
        Here you can view and manage all room types available in your hotels.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Room Type Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyRoomTypes.map((type) => (
              <tr key={type.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {type.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {type.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {type.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-900">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
