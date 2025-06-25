// safaripro_admin/src/routes/hotel-management/amenities/all-amenities.tsx
/**
 * AllAmenities Component
 * Displays a comprehensive list of all amenities available. This is the default view for the /hotel-management/amenities path.
 */
export default function AllAmenities() {
  const dummyAmenities = [
    {
      id: 1,
      name: "Free Wi-Fi",
      description: "Complimentary internet access.",
    },
    {
      id: 2,
      name: "Air Conditioning",
      description: "Climate control in rooms.",
    },
    {
      id: 3,
      name: "Minibar",
      description: "In-room mini refrigerator with drinks and snacks.",
    },
    {
      id: 4,
      name: "Complimentary Breakfast",
      description: "Free breakfast served daily.",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-medium text-gray-700 mb-4">All Amenities</h3>
      <p className="text-gray-600 mb-4">
        Here you can view and manage all amenities that can be offered in rooms
        or hotels.
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
                Amenity Name
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
            {dummyAmenities.map((amenity) => (
              <tr key={amenity.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {amenity.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {amenity.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {amenity.description}
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
